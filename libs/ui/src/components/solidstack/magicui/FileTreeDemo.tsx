import { css } from '@sse/ui/styled-system/css';
import { type Component, createSignal, For, type JSX } from 'solid-js';

interface TreeElement {
  id: string;
  isSelectable: boolean;
  name: string;
  children?: TreeElement[];
}

// Placeholder Tree component - this would need to be implemented separately
const Tree: Component<{
  className?: string;
  initialSelectedId?: string;
  initialExpandedItems?: string[];
  elements?: TreeElement[];
  children: JSX.Element;
}> = (props) => {
  const [selectedId, setSelectedId] = createSignal(props.initialSelectedId || '');
  const [expandedItems, setExpandedItems] = createSignal(props.initialExpandedItems || []);

  return (
    <div
      class={css(
        {
          fontFamily: 'mono',
          fontSize: 'sm',
          lineHeight: '1.4',
        },
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

// Placeholder Folder component
const Folder: Component<{
  element?: string;
  value: string;
  children: JSX.Element;
}> = (props) => {
  const [isExpanded, setIsExpanded] = createSignal(true);

  return (
    <div
      class={css({
        marginLeft: '0',
      })}
    >
      <div
        class={css({
          display: 'flex',
          alignItems: 'center',
          padding: '1',
          cursor: 'pointer',
          borderRadius: 'sm',
          _hover: {
            backgroundColor: 'gray.100',
            _dark: {
              backgroundColor: 'gray.800',
            },
          },
        })}
        onClick={() => setIsExpanded(!isExpanded())}
      >
        <span
          class={css({
            marginRight: '2',
            fontSize: 'xs',
            color: 'gray.500',
          })}
        >
          {isExpanded() ? '📂' : '📁'}
        </span>
        <span
          class={css({
            color: 'blue.600',
            fontWeight: 'medium',
            _dark: {
              color: 'blue.400',
            },
          })}
        >
          {props.element || props.value}
        </span>
      </div>
      {isExpanded() && (
        <div
          class={css({
            marginLeft: '4',
            borderLeft: '1px solid',
            borderColor: 'gray.200',
            paddingLeft: '2',
            _dark: {
              borderColor: 'gray.700',
            },
          })}
        >
          {props.children}
        </div>
      )}
    </div>
  );
};

// Placeholder File component
const File: Component<{
  value: string;
  children: JSX.Element;
}> = (props) => {
  const [isSelected, setIsSelected] = createSignal(false);

  return (
    <div
      class={css({
        display: 'flex',
        alignItems: 'center',
        padding: '1',
        cursor: 'pointer',
        borderRadius: 'sm',
        backgroundColor: isSelected() ? 'blue.50' : 'transparent',
        _hover: {
          backgroundColor: 'gray.100',
        },
        _dark: {
          backgroundColor: isSelected() ? 'blue.900/20' : 'transparent',
          _hover: {
            backgroundColor: 'gray.800',
          },
        },
      })}
      onClick={() => setIsSelected(!isSelected())}
    >
      <span
        class={css({
          marginRight: '2',
          fontSize: 'xs',
        })}
      >
        📄
      </span>
      <span
        class={css({
          color: 'gray.700',
          _dark: {
            color: 'gray.300',
          },
        })}
      >
        {props.children}
      </span>
    </div>
  );
};

const ELEMENTS = [
  {
    id: '1',
    isSelectable: true,
    name: 'src',
    children: [
      {
        id: '2',
        isSelectable: true,
        name: 'app',
        children: [
          {
            id: '3',
            isSelectable: true,
            name: 'layout.tsx',
          },
          {
            id: '4',
            isSelectable: true,
            name: 'page.tsx',
          },
        ],
      },
      {
        id: '5',
        isSelectable: true,
        name: 'components',
        children: [
          {
            id: '6',
            isSelectable: true,
            name: 'ui',
            children: [
              {
                id: '7',
                isSelectable: true,
                name: 'button.tsx',
              },
            ],
          },
          {
            id: '8',
            isSelectable: true,
            name: 'header.tsx',
          },
          {
            id: '9',
            isSelectable: true,
            name: 'footer.tsx',
          },
        ],
      },
      {
        id: '10',
        isSelectable: true,
        name: 'lib',
        children: [
          {
            id: '11',
            isSelectable: true,
            name: 'utils.ts',
          },
        ],
      },
    ],
  },
];

export const FileTreeDemo: Component = () => {
  return (
    <div
      class={css({
        position: 'relative',
        display: 'flex',
        height: '300px',
        width: '1/2',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'gray.200',
        backgroundColor: 'white',
        _dark: {
          borderColor: 'gray.800',
          backgroundColor: 'gray.900',
        },
      })}
    >
      <Tree
        className={css({
          overflow: 'hidden',
          borderRadius: 'md',
          backgroundColor: 'white',
          padding: '2',
          _dark: {
            backgroundColor: 'gray.900',
          },
        })}
        initialSelectedId="7"
        initialExpandedItems={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']}
        elements={ELEMENTS}
      >
        <Folder element="src" value="1">
          <Folder value="2" element="app">
            <File value="3">
              <p>layout.tsx</p>
            </File>
            <File value="4">
              <p>page.tsx</p>
            </File>
          </Folder>
          <Folder value="5" element="components">
            <Folder value="6" element="ui">
              <File value="7">
                <p>button.tsx</p>
              </File>
            </Folder>
            <File value="8">
              <p>header.tsx</p>
            </File>
            <File value="9">
              <p>footer.tsx</p>
            </File>
          </Folder>
          <Folder value="10" element="lib">
            <File value="11">
              <p>utils.ts</p>
            </File>
          </Folder>
        </Folder>
      </Tree>
    </div>
  );
};

export default FileTreeDemo;
