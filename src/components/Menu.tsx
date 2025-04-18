import { A } from '@solidjs/router';
import { Routes } from '../routes.ts'

function Menu() {
    return (
        <nav class="main-navigation">
            <ul>
                <li><A href={Routes.Home.path} class="nav-link">{Routes.Home.label}</A></li>
                <li><A href={Routes.ListFunctions.path} class="nav-link">{Routes.ListFunctions.label}</A></li>
                <li><A href={Routes.EditConfig.path} class="nav-link">{Routes.EditConfig.label}</A></li>
            </ul>
        </nav>
    );
}

export default Menu;