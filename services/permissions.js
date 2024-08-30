const DefaultQuery = 'limit=500&offset=0';
class PermissionService {

    getRolePermissions(roleId) {
        return this.$axios.get(`/permissions/role/${roleId}?${DefaultQuery}`);
    }
    getPermissions() {
        return this.$axios.get(`/permissions?${DefaultQuery}`);
    }
    getRoles() {
        return this.$axios.get(`/roles/role-permissions?${DefaultQuery}`);
    }
    assignedAndUnAssignedPermissions(roleId,payload) {
        return this.$axios.post(`/permissions/${roleId}`, payload);
    }
    assignedAndUnAssignedRoles(userId,payload) {
        return this.$axios.post(`/roles/users/${userId}`, payload);
    }
    getUserRoles(){
        return this.$axios.get('/roles/users?limit=500&offset=0');
    }
    createPermission(payload){
        return this.$axios.post('/permissions',payload);
    }
    assignPermissionsToRoles(permissionId,payload){
        return this.$axios.post(`/permissions/${permissionId}/assign-to-roles`, payload);
    }

}

export default new PermissionService();
