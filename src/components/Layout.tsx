import { A } from '@solidjs/router';
import { JSX } from 'solid-js';

interface LayoutProps {
    children?: JSX.Element;
}

function Layout(props: LayoutProps) {
    return (
        <div class="app-layout">
            <nav class="main-navigation">
                <ul>
                    <li><A href="/">Home</A></li>
                    <li><A href="/functions">Functions</A></li>
                    <li><A href="/config/edit">Settings</A></li>
                </ul>
            </nav>
            <main class="content-area">
                {props.children}
            </main>
        </div>
    );
}

export default Layout;