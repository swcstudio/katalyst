use anyhow::Result;
use std::{
    ffi::{CStr, CString, OsStr},
    fs::{File, OpenOptions},
    io::{self, Read, Write},
    mem,
    os::unix::io::{AsRawFd, FromRawFd, RawFd},
    path::{Path, PathBuf},
    ptr,
    sync::Arc,
};

#[cfg(target_os = "redox")]
use redox_syscall::{self as syscall, flag, Packet, Scheme, SchemeMut};

#[cfg(target_os = "redox")]
use redox_termios::{tcgetattr, tcsetattr, Termios, TCSANOW};

/// Redox OS compatibility layer for Katalyst Terminal
pub struct RedoxCompatLayer {
    config: RedoxConfig,
    #[cfg(target_os = "redox")]
    scheme: Option<RedoxScheme>,
    pty_pairs: Vec<PtyPair>,
    original_termios: Option<Termios>,
}

impl RedoxCompatLayer {
    pub fn new(config: RedoxConfig) -> Result<Self> {
        let mut layer = Self {
            config,
            #[cfg(target_os = "redox")]
            scheme: None,
            pty_pairs: Vec::new(),
            original_termios: None,
        };
        
        // Initialize Redox-specific features
        #[cfg(target_os = "redox")]
        {
            layer.init_redox_scheme()?;
        }
        
        // Save original terminal settings
        layer.save_terminal_state()?;
        
        Ok(layer)
    }
    
    /// Initialize Redox scheme for terminal handling
    #[cfg(target_os = "redox")]
    fn init_redox_scheme(&mut self) -> Result<()> {
        let scheme = RedoxScheme::new("katalyst")?;
        self.scheme = Some(scheme);
        Ok(())
    }
    
    /// Create a new pseudo-terminal pair
    pub fn create_pty(&mut self) -> Result<PtyPair> {
        #[cfg(target_os = "redox")]
        {
            self.create_redox_pty()
        }
        
        #[cfg(not(target_os = "redox"))]
        {
            self.create_unix_pty()
        }
    }
    
    #[cfg(target_os = "redox")]
    fn create_redox_pty(&mut self) -> Result<PtyPair> {
        // Open master PTY
        let master = syscall::open("pty:", flag::O_RDWR | flag::O_CLOEXEC)
            .map_err(|e| anyhow::anyhow!("Failed to open PTY master: {}", e))?;
        
        // Get slave name
        let mut buf = [0u8; 256];
        let len = syscall::fpath(master, &mut buf)
            .map_err(|e| anyhow::anyhow!("Failed to get PTY slave path: {}", e))?;
        
        let slave_path = std::str::from_utf8(&buf[..len])?;
        
        // Open slave PTY
        let slave = syscall::open(slave_path, flag::O_RDWR | flag::O_CLOEXEC)
            .map_err(|e| anyhow::anyhow!("Failed to open PTY slave: {}", e))?;
        
        let pair = PtyPair {
            master: master as RawFd,
            slave: slave as RawFd,
            slave_path: PathBuf::from(slave_path),
        };
        
        self.pty_pairs.push(pair.clone());
        Ok(pair)
    }
    
    #[cfg(not(target_os = "redox"))]
    fn create_unix_pty(&mut self) -> Result<PtyPair> {
        use nix::pty::{openpty, OpenptyResult};
        use nix::unistd::close;
        
        let OpenptyResult { master, slave } = openpty(None, None)?;
        
        let pair = PtyPair {
            master,
            slave,
            slave_path: PathBuf::from(format!("/dev/pts/{}", slave)),
        };
        
        self.pty_pairs.push(pair.clone());
        Ok(pair)
    }
    
    /// Configure terminal for raw mode
    pub fn enter_raw_mode(&mut self) -> Result<()> {
        #[cfg(target_os = "redox")]
        {
            self.enter_raw_mode_redox()
        }
        
        #[cfg(not(target_os = "redox"))]
        {
            self.enter_raw_mode_unix()
        }
    }
    
    #[cfg(target_os = "redox")]
    fn enter_raw_mode_redox(&mut self) -> Result<()> {
        let stdin_fd = 0; // Standard input
        
        // Get current terminal attributes
        let mut termios = tcgetattr(stdin_fd)?;
        
        // Save original settings
        if self.original_termios.is_none() {
            self.original_termios = Some(termios.clone());
        }
        
        // Modify for raw mode
        termios.c_iflag &= !(
            redox_termios::IGNBRK |
            redox_termios::BRKINT |
            redox_termios::PARMRK |
            redox_termios::ISTRIP |
            redox_termios::INLCR |
            redox_termios::IGNCR |
            redox_termios::ICRNL |
            redox_termios::IXON
        );
        
        termios.c_oflag &= !redox_termios::OPOST;
        
        termios.c_lflag &= !(
            redox_termios::ECHO |
            redox_termios::ECHONL |
            redox_termios::ICANON |
            redox_termios::ISIG |
            redox_termios::IEXTEN
        );
        
        termios.c_cflag &= !(redox_termios::CSIZE | redox_termios::PARENB);
        termios.c_cflag |= redox_termios::CS8;
        
        // Set minimum characters and timeout
        termios.c_cc[redox_termios::VMIN] = 1;
        termios.c_cc[redox_termios::VTIME] = 0;
        
        // Apply new settings
        tcsetattr(stdin_fd, TCSANOW, &termios)?;
        
        Ok(())
    }
    
    #[cfg(not(target_os = "redox"))]
    fn enter_raw_mode_unix(&mut self) -> Result<()> {
        use nix::sys::termios;
        
        let stdin_fd = 0;
        
        // Get current terminal attributes
        let mut termios = termios::tcgetattr(stdin_fd)?;
        
        // Save original settings
        if self.original_termios.is_none() {
            self.original_termios = Some(unsafe { mem::transmute(termios.clone()) });
        }
        
        // Enable raw mode
        termios::cfmakeraw(&mut termios);
        
        // Apply settings
        termios::tcsetattr(stdin_fd, termios::SetArg::TCSANOW, &termios)?;
        
        Ok(())
    }
    
    /// Restore terminal to original mode
    pub fn leave_raw_mode(&mut self) -> Result<()> {
        if let Some(ref original) = self.original_termios {
            #[cfg(target_os = "redox")]
            {
                tcsetattr(0, TCSANOW, original)?;
            }
            
            #[cfg(not(target_os = "redox"))]
            {
                use nix::sys::termios;
                let termios: termios::Termios = unsafe { mem::transmute(original.clone()) };
                termios::tcsetattr(0, termios::SetArg::TCSANOW, &termios)?;
            }
        }
        
        Ok(())
    }
    
    /// Spawn a process with PTY
    pub fn spawn_with_pty(&self, command: &str, args: &[&str], pty: &PtyPair) -> Result<u32> {
        #[cfg(target_os = "redox")]
        {
            self.spawn_redox_process(command, args, pty)
        }
        
        #[cfg(not(target_os = "redox"))]
        {
            self.spawn_unix_process(command, args, pty)
        }
    }
    
    #[cfg(target_os = "redox")]
    fn spawn_redox_process(&self, command: &str, args: &[&str], pty: &PtyPair) -> Result<u32> {
        use syscall::{clone, CloneFlags, waitpid};
        
        let command = CString::new(command)?;
        let args: Vec<CString> = args.iter()
            .map(|arg| CString::new(*arg))
            .collect::<Result<Vec<_>, _>>()?;
        
        let pid = unsafe {
            clone(CloneFlags::empty()).map_err(|e| anyhow::anyhow!("Clone failed: {}", e))?
        };
        
        if pid == 0 {
            // Child process
            
            // Set up PTY as stdio
            syscall::dup2(pty.slave, 0)?; // stdin
            syscall::dup2(pty.slave, 1)?; // stdout
            syscall::dup2(pty.slave, 2)?; // stderr
            
            // Close original FDs
            syscall::close(pty.master)?;
            syscall::close(pty.slave)?;
            
            // Execute command
            let mut argv = vec![command.as_ptr()];
            for arg in &args {
                argv.push(arg.as_ptr());
            }
            argv.push(ptr::null());
            
            syscall::execve(command.as_ptr(), argv.as_ptr(), ptr::null())?;
            
            // Should never reach here
            std::process::exit(1);
        }
        
        Ok(pid as u32)
    }
    
    #[cfg(not(target_os = "redox"))]
    fn spawn_unix_process(&self, command: &str, args: &[&str], pty: &PtyPair) -> Result<u32> {
        use nix::unistd::{fork, ForkResult, dup2, execvp};
        use std::ffi::CString;
        
        match unsafe { fork()? } {
            ForkResult::Parent { child } => {
                Ok(child.as_raw() as u32)
            }
            ForkResult::Child => {
                // Set up PTY as stdio
                dup2(pty.slave, 0)?; // stdin
                dup2(pty.slave, 1)?; // stdout
                dup2(pty.slave, 2)?; // stderr
                
                // Close original FDs
                nix::unistd::close(pty.master)?;
                nix::unistd::close(pty.slave)?;
                
                // Prepare command and arguments
                let command = CString::new(command)?;
                let args: Vec<CString> = std::iter::once(Ok(command.clone()))
                    .chain(args.iter().map(|arg| CString::new(*arg)))
                    .collect::<Result<Vec<_>, _>>()?;
                
                // Execute
                execvp(&command, &args)?;
                
                // Should never reach here
                std::process::exit(1);
            }
        }
    }
    
    /// Read from PTY
    pub fn read_pty(&self, pty: &PtyPair, buf: &mut [u8]) -> Result<usize> {
        #[cfg(target_os = "redox")]
        {
            let n = syscall::read(pty.master, buf)
                .map_err(|e| anyhow::anyhow!("PTY read failed: {}", e))?;
            Ok(n)
        }
        
        #[cfg(not(target_os = "redox"))]
        {
            use nix::unistd::read;
            let n = read(pty.master, buf)?;
            Ok(n)
        }
    }
    
    /// Write to PTY
    pub fn write_pty(&self, pty: &PtyPair, data: &[u8]) -> Result<usize> {
        #[cfg(target_os = "redox")]
        {
            let n = syscall::write(pty.master, data)
                .map_err(|e| anyhow::anyhow!("PTY write failed: {}", e))?;
            Ok(n)
        }
        
        #[cfg(not(target_os = "redox"))]
        {
            use nix::unistd::write;
            let n = write(pty.master, data)?;
            Ok(n)
        }
    }
    
    /// Resize PTY
    pub fn resize_pty(&self, pty: &PtyPair, cols: u16, rows: u16) -> Result<()> {
        #[cfg(target_os = "redox")]
        {
            // Redox-specific PTY resize
            let winsize = Winsize {
                ws_row: rows,
                ws_col: cols,
                ws_xpixel: 0,
                ws_ypixel: 0,
            };
            
            unsafe {
                syscall::ioctl(pty.master, TIOCSWINSZ, &winsize as *const _ as usize)
                    .map_err(|e| anyhow::anyhow!("Failed to resize PTY: {}", e))?;
            }
        }
        
        #[cfg(not(target_os = "redox"))]
        {
            use nix::pty::Winsize;
            use nix::sys::ioctl::ioctl_write_ptr_bad;
            
            let winsize = Winsize {
                ws_row: rows,
                ws_col: cols,
                ws_xpixel: 0,
                ws_ypixel: 0,
            };
            
            ioctl_write_ptr_bad!(tiocswinsz, libc::TIOCSWINSZ, Winsize);
            unsafe {
                tiocswinsz(pty.master, &winsize)?;
            }
        }
        
        Ok(())
    }
    
    /// Get terminal size
    pub fn get_terminal_size(&self) -> Result<(u16, u16)> {
        #[cfg(target_os = "redox")]
        {
            let mut winsize = Winsize::default();
            unsafe {
                syscall::ioctl(0, TIOCGWINSZ, &mut winsize as *mut _ as usize)
                    .map_err(|e| anyhow::anyhow!("Failed to get terminal size: {}", e))?;
            }
            Ok((winsize.ws_col, winsize.ws_row))
        }
        
        #[cfg(not(target_os = "redox"))]
        {
            use nix::sys::ioctl::ioctl_read_bad;
            use nix::pty::Winsize;
            
            ioctl_read_bad!(tiocgwinsz, libc::TIOCGWINSZ, Winsize);
            let mut winsize = Winsize {
                ws_row: 0,
                ws_col: 0,
                ws_xpixel: 0,
                ws_ypixel: 0,
            };
            
            unsafe {
                tiocgwinsz(0, &mut winsize)?;
            }
            
            Ok((winsize.ws_col, winsize.ws_row))
        }
    }
    
    fn save_terminal_state(&mut self) -> Result<()> {
        // Terminal state is saved when entering raw mode
        Ok(())
    }
    
    /// Clean up resources
    pub fn cleanup(&mut self) -> Result<()> {
        // Restore terminal
        self.leave_raw_mode()?;
        
        // Close all PTY pairs
        for pty in &self.pty_pairs {
            #[cfg(target_os = "redox")]
            {
                let _ = syscall::close(pty.master);
                let _ = syscall::close(pty.slave);
            }
            
            #[cfg(not(target_os = "redox"))]
            {
                let _ = nix::unistd::close(pty.master);
                let _ = nix::unistd::close(pty.slave);
            }
        }
        
        Ok(())
    }
}

impl Drop for RedoxCompatLayer {
    fn drop(&mut self) {
        let _ = self.cleanup();
    }
}

#[derive(Debug, Clone)]
pub struct PtyPair {
    pub master: RawFd,
    pub slave: RawFd,
    pub slave_path: PathBuf,
}

#[derive(Debug, Clone)]
pub struct RedoxConfig {
    pub enable_pty: bool,
    pub enable_raw_mode: bool,
    pub buffer_size: usize,
    pub scheme_name: String,
}

impl Default for RedoxConfig {
    fn default() -> Self {
        Self {
            enable_pty: true,
            enable_raw_mode: true,
            buffer_size: 4096,
            scheme_name: "katalyst".to_string(),
        }
    }
}

#[cfg(target_os = "redox")]
struct RedoxScheme {
    name: String,
    socket: File,
}

#[cfg(target_os = "redox")]
impl RedoxScheme {
    fn new(name: &str) -> Result<Self> {
        let socket = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .open(format!(":{}", name))?;
        
        Ok(Self {
            name: name.to_string(),
            socket,
        })
    }
}

#[cfg(target_os = "redox")]
impl SchemeMut for RedoxScheme {
    fn open(&mut self, path: &str, flags: usize, uid: u32, gid: u32) -> syscall::Result<usize> {
        // Handle scheme open requests
        Ok(0)
    }
    
    fn read(&mut self, id: usize, buf: &mut [u8]) -> syscall::Result<usize> {
        // Handle read requests
        Ok(0)
    }
    
    fn write(&mut self, id: usize, buf: &[u8]) -> syscall::Result<usize> {
        // Handle write requests
        Ok(buf.len())
    }
    
    fn close(&mut self, id: usize) -> syscall::Result<usize> {
        // Handle close requests
        Ok(0)
    }
}

#[repr(C)]
#[derive(Debug, Default, Clone, Copy)]
struct Winsize {
    ws_row: u16,
    ws_col: u16,
    ws_xpixel: u16,
    ws_ypixel: u16,
}

// IOCTL constants for terminal control
#[cfg(target_os = "redox")]
const TIOCGWINSZ: usize = 0x5413;
#[cfg(target_os = "redox")]
const TIOCSWINSZ: usize = 0x5414;

/// Platform detection utilities
pub fn is_redox() -> bool {
    cfg!(target_os = "redox")
}

pub fn get_platform_info() -> PlatformInfo {
    PlatformInfo {
        os: if cfg!(target_os = "redox") {
            "Redox OS".to_string()
        } else if cfg!(target_os = "linux") {
            "Linux".to_string()
        } else if cfg!(target_os = "macos") {
            "macOS".to_string()
        } else {
            "Unknown".to_string()
        },
        arch: std::env::consts::ARCH.to_string(),
        family: std::env::consts::FAMILY.to_string(),
    }
}

#[derive(Debug, Clone)]
pub struct PlatformInfo {
    pub os: String,
    pub arch: String,
    pub family: String,
}