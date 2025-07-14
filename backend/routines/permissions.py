from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Permiso personalizado para permitir que solo los administradores (staff)
    puedan editar un objeto. Los demás usuarios solo pueden leer.
    """

    def has_permission(self, request, view):
        # Los permisos de LECTURA (GET, HEAD, OPTIONS) se permiten a cualquier usuario
        # que esté autenticado (lo cual ya lo controla IsAuthenticated).
        if request.method in SAFE_METHODS:
            return True

        # Los permisos de ESCRITURA (POST, PUT, PATCH, DELETE) solo se permiten
        # si el usuario es miembro del staff (administrador).
        return request.user and request.user.is_staff