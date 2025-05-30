import { createSignal } from 'solid-js';
import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';

const ContactPage = () => {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [message, setMessage] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitStatus, setSubmitStatus] = createSignal<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!name() || !email() || !message()) {
      alert('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name(),
          email: email(),
          message: message(),
        }),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section
        class={css({
          py: { base: '12', md: '20' },
        })}
      >
        <h1
          class={css({
            fontSize: { base: '3xl', md: '5xl' },
            fontWeight: 'bold',
            color: 'gray.900',
            mb: '8',
          })}
        >
          Contact Us
        </h1>
        <div
          class={css({
            maxWidth: '800px',
            fontSize: { base: 'md', md: 'lg' },
            color: 'gray.700',
            lineHeight: 'tall',
            mb: '12',
          })}
        >
          <p>
            Have questions about our SOTA Marketing Stack? Want to learn more about our services?
            Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div
          class={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
            gap: '12',
          })}
        >
          <div>
            <form
              onSubmit={handleSubmit}
              class={css({
                bg: 'white',
                p: '8',
                rounded: 'lg',
                shadow: 'md',
              })}
            >
              <div
                class={css({
                  mb: '6',
                })}
              >
                <label
                  for="name"
                  class={css({
                    display: 'block',
                    mb: '2',
                    fontWeight: 'medium',
                    color: 'gray.700',
                  })}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  required
                  class={css({
                    w: '100%',
                    p: '3',
                    border: '1px solid',
                    borderColor: 'gray.300',
                    rounded: 'md',
                    _focus: {
                      borderColor: 'primary.500',
                      ring: '1px',
                      ringColor: 'primary.500',
                    },
                  })}
                />
              </div>

              <div
                class={css({
                  mb: '6',
                })}
              >
                <label
                  for="email"
                  class={css({
                    display: 'block',
                    mb: '2',
                    fontWeight: 'medium',
                    color: 'gray.700',
                  })}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  required
                  class={css({
                    w: '100%',
                    p: '3',
                    border: '1px solid',
                    borderColor: 'gray.300',
                    rounded: 'md',
                    _focus: {
                      borderColor: 'primary.500',
                      ring: '1px',
                      ringColor: 'primary.500',
                    },
                  })}
                />
              </div>

              <div
                class={css({
                  mb: '6',
                })}
              >
                <label
                  for="message"
                  class={css({
                    display: 'block',
                    mb: '2',
                    fontWeight: 'medium',
                    color: 'gray.700',
                  })}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message()}
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  required
                  rows={6}
                  class={css({
                    w: '100%',
                    p: '3',
                    border: '1px solid',
                    borderColor: 'gray.300',
                    rounded: 'md',
                    _focus: {
                      borderColor: 'primary.500',
                      ring: '1px',
                      ringColor: 'primary.500',
                    },
                  })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting()}
                class={css({
                  w: '100%',
                  py: '3',
                  px: '4',
                  bg: 'primary.500',
                  color: 'white',
                  fontWeight: 'medium',
                  rounded: 'md',
                  _hover: {
                    bg: 'primary.600',
                  },
                  _disabled: {
                    opacity: 0.7,
                    cursor: 'not-allowed',
                  },
                })}
              >
                {isSubmitting() ? 'Submitting...' : 'Send Message'}
              </button>

              {submitStatus() === 'success' && (
                <div
                  class={css({
                    mt: '4',
                    p: '3',
                    bg: 'green.100',
                    color: 'green.800',
                    rounded: 'md',
                  })}
                >
                  Your message has been sent successfully. We'll get back to you soon!
                </div>
              )}

              {submitStatus() === 'error' && (
                <div
                  class={css({
                    mt: '4',
                    p: '3',
                    bg: 'red.100',
                    color: 'red.800',
                    rounded: 'md',
                  })}
                >
                  There was an error sending your message. Please try again later.
                </div>
              )}
            </form>
          </div>

          <div>
            <div
              class={css({
                bg: 'white',
                p: '8',
                rounded: 'lg',
                shadow: 'md',
              })}
            >
              <h2
                class={css({
                  fontSize: 'xl',
                  fontWeight: 'bold',
                  color: 'gray.900',
                  mb: '4',
                })}
              >
                Get in Touch
              </h2>

              <div
                class={flex({
                  direction: 'column',
                  gap: '4',
                })}
              >
                <div
                  class={flex({
                    align: 'center',
                    gap: '3',
                  })}
                >
                  <div
                    class={css({
                      w: '10',
                      h: '10',
                      bg: 'primary.100',
                      color: 'primary.700',
                      rounded: 'full',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    })}
                  >
                    <span>📧</span>
                  </div>
                  <div>
                    <div
                      class={css({
                        fontWeight: 'medium',
                        color: 'gray.700',
                      })}
                    >
                      Email
                    </div>
                    <a
                      href="mailto:info@spectrumwebco.com"
                      class={css({
                        color: 'primary.600',
                        _hover: {
                          textDecoration: 'underline',
                        },
                      })}
                    >
                      info@spectrumwebco.com
                    </a>
                  </div>
                </div>

                <div
                  class={flex({
                    align: 'center',
                    gap: '3',
                  })}
                >
                  <div
                    class={css({
                      w: '10',
                      h: '10',
                      bg: 'primary.100',
                      color: 'primary.700',
                      rounded: 'full',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    })}
                  >
                    <span>📱</span>
                  </div>
                  <div>
                    <div
                      class={css({
                        fontWeight: 'medium',
                        color: 'gray.700',
                      })}
                    >
                      Phone
                    </div>
                    <a
                      href="tel:+1234567890"
                      class={css({
                        color: 'primary.600',
                        _hover: {
                          textDecoration: 'underline',
                        },
                      })}
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div
                  class={flex({
                    align: 'center',
                    gap: '3',
                  })}
                >
                  <div
                    class={css({
                      w: '10',
                      h: '10',
                      bg: 'primary.100',
                      color: 'primary.700',
                      rounded: 'full',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    })}
                  >
                    <span>🌐</span>
                  </div>
                  <div>
                    <div
                      class={css({
                        fontWeight: 'medium',
                        color: 'gray.700',
                      })}
                    >
                      Social
                    </div>
                    <div
                      class={flex({
                        gap: '3',
                        mt: '1',
                      })}
                    >
                      <a
                        href="https://twitter.com/spectrumwebco"
                        target="_blank"
                        rel="noopener noreferrer"
                        class={css({
                          color: 'primary.600',
                          _hover: {
                            color: 'primary.700',
                          },
                        })}
                      >
                        Twitter
                      </a>
                      <a
                        href="https://linkedin.com/company/spectrumwebco"
                        target="_blank"
                        rel="noopener noreferrer"
                        class={css({
                          color: 'primary.600',
                          _hover: {
                            color: 'primary.700',
                          },
                        })}
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://github.com/spectrumwebco"
                        target="_blank"
                        rel="noopener noreferrer"
                        class={css({
                          color: 'primary.600',
                          _hover: {
                            color: 'primary.700',
                          },
                        })}
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
