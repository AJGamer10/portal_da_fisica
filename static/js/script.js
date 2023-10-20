// Mostrar a Sidebar
document.addEventListener('DOMContentLoaded', function () {
    const mostrarSidebarButton = document.getElementById('mostrarSidebar');
    const fecharSidebarButton = document.getElementById('fecharSidebar');
    const minhaSidebar = document.getElementById('minhaSidebar');

    mostrarSidebarButton.addEventListener('click', function () {
        minhaSidebar.style.left = '0'; // Mostra a barra lateral
    });

    fecharSidebarButton.addEventListener('click', function () {
        minhaSidebar.style.left = '-250px'; // Esconde a barra lateral
    });
});