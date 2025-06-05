import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';

// Placeholder CodeComparison component - this would need to be implemented separately
const CodeComparison: Component<{
  beforeCode: string;
  afterCode: string;
  language: string;
  filename: string;
  lightTheme: string;
  darkTheme: string;
  highlightColor: string;
}> = (props) => {
  return (
    <div class={css({
      display: 'grid',
      gridTemplateColumns: '2',
      gap: '4',
      backgroundColor: 'gray.50',
      borderRadius: 'lg',
      border: '1px solid',
      borderColor: 'gray.200',
      overflow: 'hidden',
      _dark: {
        backgroundColor: 'gray.900',
        borderColor: 'gray.700',
      },
    })}>
      {/* Header */}
      <div class={css({
        gridColumn: 'span 2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3',
        backgroundColor: 'gray.100',
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        _dark: {
          backgroundColor: 'gray.800',
          borderColor: 'gray.700',
        },
      })}>
        <span class={css({
          fontSize: 'sm',
          fontWeight: 'medium',
          color: 'gray.700',
          _dark: {
            color: 'gray.300',
          },
        })}>
          {props.filename}
        </span>
      </div>

      {/* Before Code */}
      <div class={css({
        position: 'relative',
      })}>
        <div class={css({
          position: 'absolute',
          top: '2',
          left: '2',
          backgroundColor: 'red.100',
          color: 'red.800',
          fontSize: 'xs',
          fontWeight: 'medium',
          paddingX: '2',
          paddingY: '1',
          borderRadius: 'sm',
          _dark: {
            backgroundColor: 'red.900/20',
            color: 'red.400',
          },
        })}>
          Before
        </div>
        <pre class={css({
          padding: '4',
          paddingTop: '10',
          fontSize: 'sm',
          fontFamily: 'mono',
          color: 'gray.800',
          backgroundColor: 'white',
          overflow: 'auto',
          height: '400px',
          _dark: {
            color: 'gray.200',
            backgroundColor: 'gray.950',
          },
        })}>
          <code>{props.beforeCode}</code>
        </pre>
      </div>

      {/* After Code */}
      <div class={css({
        position: 'relative',
      })}>
        <div class={css({
          position: 'absolute',
          top: '2',
          right: '2',
          backgroundColor: 'green.100',
          color: 'green.800',
          fontSize: 'xs',
          fontWeight: 'medium',
          paddingX: '2',
          paddingY: '1',
          borderRadius: 'sm',
          _dark: {
            backgroundColor: 'green.900/20',
            color: 'green.400',
          },
        })}>
          After
        </div>
        <pre class={css({
          padding: '4',
          paddingTop: '10',
          fontSize: 'sm',
          fontFamily: 'mono',
          color: 'gray.800',
          backgroundColor: 'white',
          overflow: 'auto',
          height: '400px',
          _dark: {
            color: 'gray.200',
            backgroundColor: 'gray.950',
          },
        })}>
          <code>{props.afterCode}</code>
        </pre>
      </div>
    </div>
  );
};

const beforeCode = `import { NextRequest } from 'next/server';

export const middleware = async (req: NextRequest) => {
  let user = undefined;
  let team = undefined;
  const token = req.headers.get('token'); 

  if(req.nextUrl.pathname.startsWith('/auth')) {
    user = await getUserByToken(token);

    if(!user) {
      return NextResponse.redirect('/login');
    }
  }

  if(req.nextUrl.pathname.startsWith('/team')) {
    user = await getUserByToken(token);

    if(!user) {
      return NextResponse.redirect('/login');
    }

    const slug = req.nextUrl.query.slug;
    team = await getTeamBySlug(slug); // [!code highlight]

    if(!team) { // [!code highlight]
      return NextResponse.redirect('/'); // [!code highlight]
    } // [!code highlight]
  } // [!code highlight]

  return NextResponse.next(); // [!code highlight]
}

export const config = {
  matcher: ['/((?!_next/|_static|_vercel|[\\w-]+\\.\\w+).*)'], // [!code highlight]
};`;

const afterCode = `import { createMiddleware, type MiddlewareFunctionProps } from '@app/(auth)/auth/_middleware';
import { auth } from '@/app/(auth)/auth/_middleware'; // [!code --]
import { auth } from '@/app/(auth)/auth/_middleware'; // [!code ++]
import { team } from '@/app/(team)/team/_middleware';

const middlewares = {
  '/auth{/:path?}': auth,
  '/team{/:slug?}': [ auth, team ],
};

export const middleware = createMiddleware(middlewares); // [!code focus]

export const config = {
  matcher: ['/((?!_next/|_static|_vercel|[\\w-]+\\.\\w+).*)'],
};`;

export const CodeComparisonDemo: Component = () => {
  return (
    <div class={css({
      maxWidth: '6xl',
      marginX: 'auto',
      padding: '4',
    })}>
      <CodeComparison
        beforeCode={beforeCode}
        afterCode={afterCode}
        language="typescript"
        filename="middleware.ts"
        lightTheme="github-light"
        darkTheme="github-dark"
        highlightColor="rgba(101, 117, 133, 0.16)"
      />
    </div>
  );
};

export default CodeComparisonDemo;