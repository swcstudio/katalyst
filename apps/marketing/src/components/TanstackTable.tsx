import { createSignal, For } from 'solid-js';
import { css } from '../styled-system/css';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
}

const defaultData: Person[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    age: 32,
    visits: 10,
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 27,
    visits: 15,
    status: 'inactive',
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    age: 45,
    visits: 5,
    status: 'active',
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    age: 29,
    visits: 20,
    status: 'pending',
  },
  {
    id: '5',
    firstName: 'Charlie',
    lastName: 'Brown',
    age: 38,
    visits: 12,
    status: 'active',
  },
];

const TanstackTable = () => {
  const [data, _setData] = createSignal(defaultData);
  const [sortField, setSortField] = createSignal<keyof Person | null>(null);
  const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');

  const sortedData = () => {
    const currentData = data();
    const field = sortField();
    
    if (!field) return currentData;
    
    return [...currentData].sort((a, b) => {
      if (sortDirection() === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
  };

  const handleSort = (field: keyof Person) => {
    if (sortField() === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (field: keyof Person) => {
    if (sortField() !== field) return '';
    return sortDirection() === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div
      class={css({ padding: '4', borderRadius: 'md', bg: 'gray.50', _dark: { bg: 'gray.800' } })}
    >
      <h2
        class={css({ fontSize: '2xl', fontWeight: 'bold', mb: '4', color: 'emerald.500' })}
      >
        Tanstack Table Example
      </h2>
      
      <div
        class={css({ overflowX: 'auto' })}
      >
        <table
          class={css({ width: '100%', borderCollapse: 'collapse' })}
        >
          <thead>
            <tr
              class={css({ borderBottom: '1px solid', borderColor: 'gray.300', _dark: { borderColor: 'gray.600' } })}
            >
              <th 
                class={css({ 
                  p: '3', 
                  textAlign: 'left', 
                  fontWeight: 'semibold',
                  cursor: 'pointer',
                  _hover: { bg: 'gray.100', _dark: { bg: 'gray.700' } }
                })}
                onClick={() => handleSort('firstName')}
              >
                First Name{getSortIndicator('firstName')}
              </th>
              <th 
                class={css({ 
                  p: '3', 
                  textAlign: 'left', 
                  fontWeight: 'semibold',
                  cursor: 'pointer',
                  _hover: { bg: 'gray.100', _dark: { bg: 'gray.700' } }
                })}
                onClick={() => handleSort('lastName')}
              >
                Last Name{getSortIndicator('lastName')}
              </th>
              <th 
                class={css({ 
                  p: '3', 
                  textAlign: 'left', 
                  fontWeight: 'semibold',
                  cursor: 'pointer',
                  _hover: { bg: 'gray.100', _dark: { bg: 'gray.700' } }
                })}
                onClick={() => handleSort('age')}
              >
                Age{getSortIndicator('age')}
              </th>
              <th 
                class={css({ 
                  p: '3', 
                  textAlign: 'left', 
                  fontWeight: 'semibold',
                  cursor: 'pointer',
                  _hover: { bg: 'gray.100', _dark: { bg: 'gray.700' } }
                })}
                onClick={() => handleSort('visits')}
              >
                Visits{getSortIndicator('visits')}
              </th>
              <th 
                class={css({ 
                  p: '3', 
                  textAlign: 'left', 
                  fontWeight: 'semibold',
                  cursor: 'pointer',
                  _hover: { bg: 'gray.100', _dark: { bg: 'gray.700' } }
                })}
                onClick={() => handleSort('status')}
              >
                Status{getSortIndicator('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={sortedData()}>
              {(person) => (
                <tr
                  class={css({ 
                    borderBottom: '1px solid', 
                    borderColor: 'gray.200',
                    _dark: { borderColor: 'gray.700' },
                    _hover: { bg: 'gray.100', _dark: { bg: 'gray.700' } }
                  })}
                >
                  <td class={css({ p: '3' })}>{person.firstName}</td>
                  <td class={css({ p: '3' })}>{person.lastName}</td>
                  <td class={css({ p: '3' })}>{person.age}</td>
                  <td class={css({ p: '3' })}>{person.visits}</td>
                  <td class={css({ p: '3' })}>
                    <span
                      class={css({ 
                        px: '2', 
                        py: '1', 
                        borderRadius: 'full', 
                        fontSize: 'xs',
                        fontWeight: 'medium',
                        bg: person.status === 'active' ? 'green.100' : 
                            person.status === 'inactive' ? 'red.100' : 'yellow.100',
                        color: person.status === 'active' ? 'green.800' : 
                               person.status === 'inactive' ? 'red.800' : 'yellow.800',
                        _dark: {
                          bg: person.status === 'active' ? 'green.900' : 
                              person.status === 'inactive' ? 'red.900' : 'yellow.900',
                          color: person.status === 'active' ? 'green.200' : 
                                 person.status === 'inactive' ? 'red.200' : 'yellow.200',
                        }
                      })}
                    >
                      {person.status}
                    </span>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TanstackTable;

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */

/*
 * © 2025 Spectrum Web Co LLC. All rights reserved.
 * This code is the property of Spectrum Web Co LLC.
 * Licensed under MIT License.
 */
