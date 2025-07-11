import { createSignal, Show } from 'solid-js';
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const TanstackForm = () => {
  const [formData, setFormData] = createSignal<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = createSignal<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSubmitted, setIsSubmitted] = createSignal(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const data = formData();

    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!data.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (data.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      }, 1500);
    }
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData({
      ...formData(),
      [target.name]: target.value,
    });
  };

  return (
    <div
      class={css({ padding: '4', borderRadius: 'md', bg: 'gray.50', _dark: { bg: 'gray.800' } })}
    >
      <h2 class={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4', color: 'emerald.500' })}>
        Tanstack Form Example
      </h2>

      <Show
        when={!isSubmitted()}
        fallback={
          <div
            class={css({
              p: '4',
              bg: 'green.100',
              color: 'green.800',
              borderRadius: 'md',
              _dark: { bg: 'green.900', color: 'green.200' },
            })}
          >
            Thank you for your submission! We'll get back to you soon.
          </div>
        }
      >
        <form onSubmit={handleSubmit} class={flex({ direction: 'column', gap: '4' })}>
          <div>
            <label
              for="name"
              class={css({
                display: 'block',
                mb: '1',
                fontWeight: 'medium',
                color: 'gray.700',
                _dark: { color: 'gray.300' },
              })}
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData().name}
              onInput={handleChange}
              class={css({
                width: '100%',
                p: '2',
                borderRadius: 'md',
                border: '1px solid',
                borderColor: errors().name ? 'red.500' : 'gray.300',
                _dark: {
                  bg: 'gray.700',
                  borderColor: errors().name ? 'red.500' : 'gray.600',
                  color: 'white',
                },
                _focus: {
                  outline: 'none',
                  borderColor: 'emerald.500',
                  boxShadow: '0 0 0 1px var(--colors-emerald-500)',
                },
              })}
            />
            <Show when={errors().name}>
              <p class={css({ mt: '1', fontSize: 'sm', color: 'red.500' })}>{errors().name}</p>
            </Show>
          </div>

          <div>
            <label
              for="email"
              class={css({
                display: 'block',
                mb: '1',
                fontWeight: 'medium',
                color: 'gray.700',
                _dark: { color: 'gray.300' },
              })}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData().email}
              onInput={handleChange}
              class={css({
                width: '100%',
                p: '2',
                borderRadius: 'md',
                border: '1px solid',
                borderColor: errors().email ? 'red.500' : 'gray.300',
                _dark: {
                  bg: 'gray.700',
                  borderColor: errors().email ? 'red.500' : 'gray.600',
                  color: 'white',
                },
                _focus: {
                  outline: 'none',
                  borderColor: 'emerald.500',
                  boxShadow: '0 0 0 1px var(--colors-emerald-500)',
                },
              })}
            />
            <Show when={errors().email}>
              <p class={css({ mt: '1', fontSize: 'sm', color: 'red.500' })}>{errors().email}</p>
            </Show>
          </div>

          <div>
            <label
              for="message"
              class={css({
                display: 'block',
                mb: '1',
                fontWeight: 'medium',
                color: 'gray.700',
                _dark: { color: 'gray.300' },
              })}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData().message}
              onInput={handleChange}
              rows={4}
              class={css({
                width: '100%',
                p: '2',
                borderRadius: 'md',
                border: '1px solid',
                borderColor: errors().message ? 'red.500' : 'gray.300',
                _dark: {
                  bg: 'gray.700',
                  borderColor: errors().message ? 'red.500' : 'gray.600',
                  color: 'white',
                },
                _focus: {
                  outline: 'none',
                  borderColor: 'emerald.500',
                  boxShadow: '0 0 0 1px var(--colors-emerald-500)',
                },
              })}
            />
            <Show when={errors().message}>
              <p class={css({ mt: '1', fontSize: 'sm', color: 'red.500' })}>{errors().message}</p>
            </Show>
          </div>

          <button
            type="submit"
            disabled={isSubmitting()}
            class={css({
              mt: '2',
              py: '2',
              px: '4',
              bg: 'emerald.500',
              color: 'white',
              borderRadius: 'md',
              fontWeight: 'medium',
              _hover: { bg: 'emerald.600' },
              _disabled: {
                bg: 'gray.400',
                cursor: 'not-allowed',
                _hover: { bg: 'gray.400' },
              },
              _dark: {
                _disabled: {
                  bg: 'gray.600',
                  _hover: { bg: 'gray.600' },
                },
              },
            })}
          >
            {isSubmitting() ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </Show>
    </div>
  );
};

export default TanstackForm;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
