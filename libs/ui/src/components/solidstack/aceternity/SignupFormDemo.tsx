import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder Icon components - these would need to be implemented separately
const IconBrandGithub: Component<{ class?: string }> = (props) => (
  <svg class={props.class} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const IconBrandGoogle: Component<{ class?: string }> = (props) => (
  <svg class={props.class} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const IconBrandOnlyfans: Component<{ class?: string }> = (props) => (
  <svg class={props.class} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);

// Placeholder Label component
const Label: Component<{ for?: string; children: any; class?: string }> = (props) => (
  <label 
    for={props.for}
    class={css({
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'gray.700',
      _dark: { color: 'gray.300' },
    }, props.class)}
  >
    {props.children}
  </label>
);

// Placeholder Input component
const Input: Component<{ 
  id?: string; 
  placeholder?: string; 
  type?: string; 
  class?: string;
  value?: string;
  onInput?: (e: Event) => void;
}> = (props) => (
  <input
    id={props.id}
    placeholder={props.placeholder}
    type={props.type}
    value={props.value}
    onInput={props.onInput}
    class={css({
      width: 'full',
      padding: '3',
      borderRadius: 'md',
      border: '1px solid',
      borderColor: 'gray.300',
      fontSize: 'sm',
      _focus: {
        outline: 'none',
        borderColor: 'blue.500',
        boxShadow: '0 0 0 1px rgb(59 130 246)',
      },
      _dark: {
        backgroundColor: 'gray.800',
        borderColor: 'gray.600',
        color: 'white',
      },
    }, props.class)}
  />
);

const BottomGradient: Component = () => {
  return (
    <>
      <span class={css({
        position: 'absolute',
        insetX: '0',
        bottom: '-1px',
        display: 'block',
        height: '1px',
        width: 'full',
        background: 'linear-gradient(to right, transparent, rgb(6, 182, 212), transparent)', // via-cyan-500
        opacity: '0',
        transition: 'opacity 0.5s',
        _groupHover: {
          opacity: '100',
        },
      })} />
      <span class={css({
        position: 'absolute',
        insetX: '10',
        bottom: '-1px',
        marginX: 'auto',
        display: 'block',
        height: '1px',
        width: '1/2',
        background: 'linear-gradient(to right, transparent, rgb(99, 102, 241), transparent)', // via-indigo-500
        opacity: '0',
        filter: 'blur(1px)',
        transition: 'opacity 0.5s',
        _groupHover: {
          opacity: '100',
        },
      })} />
    </>
  );
};

const LabelInputContainer: Component<{
  children: any;
  className?: string;
}> = (props) => {
  return (
    <div class={css({
      display: 'flex',
      width: 'full',
      flexDirection: 'column',
      gap: '2',
    }, props.className)}>
      {props.children}
    </div>
  );
};

export const SignupFormDemo: Component = () => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div class={css({
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-input equivalent
      marginX: 'auto',
      width: 'full',
      maxWidth: 'md',
      borderRadius: 'none',
      backgroundColor: 'white',
      padding: '4',
      md: {
        borderRadius: '2xl',
        padding: '8',
      },
      _dark: {
        backgroundColor: 'black',
      },
    })}>
      <h2 class={css({
        fontSize: 'xl',
        fontWeight: 'bold',
        color: 'neutral.800',
        _dark: { color: 'neutral.200' },
      })}>
        Welcome to Aceternity
      </h2>
      <p class={css({
        marginTop: '2',
        maxWidth: 'sm',
        fontSize: 'sm',
        color: 'neutral.600',
        _dark: { color: 'neutral.300' },
      })}>
        Login to aceternity if you can because we don't have a login flow yet
      </p>

      <form class={css({ marginY: '8' })} onSubmit={handleSubmit}>
        <div class={css({
          marginBottom: '4',
          display: 'flex',
          flexDirection: 'column',
          gap: '2',
          md: {
            flexDirection: 'row',
            spaceY: '0',
            spaceX: '2',
          },
        })}>
          <LabelInputContainer>
            <Label for="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label for="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className={css({ marginBottom: '4' })}>
          <Label for="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className={css({ marginBottom: '4' })}>
          <Label for="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <LabelInputContainer className={css({ marginBottom: '8' })}>
          <Label for="twitterpassword">Your twitter password</Label>
          <Input
            id="twitterpassword"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <button
          class={css({
            group: 'btn',
            position: 'relative',
            display: 'block',
            height: '10',
            width: 'full',
            borderRadius: 'md',
            background: 'linear-gradient(to bottom right, black, rgb(82, 82, 82))', // from-black to-neutral-600
            fontWeight: 'medium',
            color: 'white',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.25), inset 0 -1px 0 0 rgba(255, 255, 255, 0.25)',
            _dark: {
              backgroundColor: 'zinc.800',
              background: 'linear-gradient(to bottom right, rgb(24, 24, 27), rgb(24, 24, 27))',
              boxShadow: 'inset 0 1px 0 0 rgb(39, 39, 42), inset 0 -1px 0 0 rgb(39, 39, 42)',
            },
          })}
          type="submit"
        >
          Sign up →
          <BottomGradient />
        </button>

        <div class={css({
          marginY: '8',
          height: '1px',
          width: 'full',
          background: 'linear-gradient(to right, transparent, rgb(212, 212, 212), transparent)',
          _dark: {
            background: 'linear-gradient(to right, transparent, rgb(64, 64, 64), transparent)',
          },
        })} />

        <div class={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
        })}>
          <button
            class={css({
              group: 'btn',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              display: 'flex',
              height: '10',
              width: 'full',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '2',
              borderRadius: 'md',
              backgroundColor: 'gray.50',
              paddingX: '4',
              fontWeight: 'medium',
              color: 'black',
              _dark: {
                backgroundColor: 'zinc.900',
                boxShadow: '0 0 1px 1px rgb(38, 38, 38)',
              },
            })}
            type="button"
          >
            <IconBrandGithub class={css({
              height: '4',
              width: '4',
              color: 'neutral.800',
              _dark: { color: 'neutral.300' },
            })} />
            <span class={css({
              fontSize: 'sm',
              color: 'neutral.700',
              _dark: { color: 'neutral.300' },
            })}>
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            class={css({
              group: 'btn',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              display: 'flex',
              height: '10',
              width: 'full',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '2',
              borderRadius: 'md',
              backgroundColor: 'gray.50',
              paddingX: '4',
              fontWeight: 'medium',
              color: 'black',
              _dark: {
                backgroundColor: 'zinc.900',
                boxShadow: '0 0 1px 1px rgb(38, 38, 38)',
              },
            })}
            type="button"
          >
            <IconBrandGoogle class={css({
              height: '4',
              width: '4',
              color: 'neutral.800',
              _dark: { color: 'neutral.300' },
            })} />
            <span class={css({
              fontSize: 'sm',
              color: 'neutral.700',
              _dark: { color: 'neutral.300' },
            })}>
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            class={css({
              group: 'btn',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              display: 'flex',
              height: '10',
              width: 'full',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '2',
              borderRadius: 'md',
              backgroundColor: 'gray.50',
              paddingX: '4',
              fontWeight: 'medium',
              color: 'black',
              _dark: {
                backgroundColor: 'zinc.900',
                boxShadow: '0 0 1px 1px rgb(38, 38, 38)',
              },
            })}
            type="button"
          >
            <IconBrandOnlyfans class={css({
              height: '4',
              width: '4',
              color: 'neutral.800',
              _dark: { color: 'neutral.300' },
            })} />
            <span class={css({
              fontSize: 'sm',
              color: 'neutral.700',
              _dark: { color: 'neutral.300' },
            })}>
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupFormDemo;