import { createSignal } from 'solid-js';
interface UserStore {
  id: number;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}
import { css } from '../styled-system/css';

export default function TanstackStore() {
  const initialUser: UserStore = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      theme: 'light' as const,
      notifications: true,
      language: 'en',
    },
  };

  const [user, setUser] = createSignal<UserStore>(initialUser);
  
  const [nameInput, setNameInput] = createSignal(user().name);
  const [emailInput, setEmailInput] = createSignal(user().email);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    setUser(prev => ({
      ...prev,
      name: nameInput(),
      email: emailInput(),
    }));
  };

  const toggleTheme = () => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === 'light' ? 'dark' : 'light',
      }
    }));
  };

  const toggleNotifications = () => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: !prev.preferences.notifications,
      }
    }));
  };

  const changeLanguage = (language: string) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        language,
      }
    }));
  };

  return (
    <div class={css({ padding: '4', borderRadius: 'md', bg: 'gray.50', _dark: { bg: 'gray.800' } })}>
      <h2 class={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4', color: 'emerald.500' })}>
        Tanstack Store Example
      </h2>
      
      <div class={css({ display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr' }, gap: '6' })}>
        <div>
          <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold', mb: '3' })}>User Profile</h3>
          <form onSubmit={handleSubmit} class={css({ mb: '4' })}>
            <div class={css({ mb: '3' })}>
              <label class={css({ display: 'block', mb: '1', fontWeight: 'medium' })}>
                Name
              </label>
              <input
                type="text"
                value={nameInput()}
                onInput={(e) => setNameInput(e.currentTarget.value)}
                class={css({
                  width: '100%',
                  p: '2',
                  border: '1px solid',
                  borderColor: 'gray.300',
                  _dark: { borderColor: 'gray.600', bg: 'gray.700' },
                  borderRadius: 'md',
                })}
              />
            </div>
            
            <div class={css({ mb: '3' })}>
              <label class={css({ display: 'block', mb: '1', fontWeight: 'medium' })}>
                Email
              </label>
              <input
                type="email"
                value={emailInput()}
                onInput={(e) => setEmailInput(e.currentTarget.value)}
                class={css({
                  width: '100%',
                  p: '2',
                  border: '1px solid',
                  borderColor: 'gray.300',
                  _dark: { borderColor: 'gray.600', bg: 'gray.700' },
                  borderRadius: 'md',
                })}
              />
            </div>
            
            <button
              type="submit"
              class={css({
                bg: 'emerald.500',
                color: 'white',
                px: '4',
                py: '2',
                borderRadius: 'md',
                fontWeight: 'medium',
                _hover: { bg: 'emerald.600' },
              })}
            >
              Update Profile
            </button>
          </form>
          
          <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold', mb: '3' })}>Preferences</h3>
          <div class={css({ mb: '3' })}>
            <button
              type="button"
              onClick={toggleTheme}
              class={css({
                bg: 'gray.200',
                _dark: { bg: 'gray.700' },
                px: '3',
                py: '1',
                borderRadius: 'md',
                mr: '2',
              })}
            >
              Toggle Theme ({user().preferences.theme})
            </button>
            
            <button
              type="button"
              onClick={toggleNotifications}
              class={css({
                bg: 'gray.200',
                _dark: { bg: 'gray.700' },
                px: '3',
                py: '1',
                borderRadius: 'md',
              })}
            >
              {user().preferences.notifications ? 'Disable' : 'Enable'} Notifications
            </button>
          </div>
          
          <div>
            <label class={css({ display: 'block', mb: '1', fontWeight: 'medium' })}>
              Language
            </label>
            <select
              value={user().preferences.language}
              onChange={(e) => changeLanguage(e.currentTarget.value)}
              class={css({
                p: '2',
                border: '1px solid',
                borderColor: 'gray.300',
                _dark: { borderColor: 'gray.600', bg: 'gray.700' },
                borderRadius: 'md',
              })}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
        
        <div>
          <h3 class={css({ fontSize: 'lg', fontWeight: 'semibold', mb: '3' })}>Current Store State</h3>
          <pre
            class={css({
              p: '3',
              bg: 'gray.100',
              _dark: { bg: 'gray.900' },
              borderRadius: 'md',
              overflow: 'auto',
              fontSize: 'sm',
            })}
          >
            {JSON.stringify(user(), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
