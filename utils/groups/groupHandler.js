import { useFetch } from '#app';

export async function addGroup(data) {
    const { data: responseData, error } = await useFetch('/api/groups/post', {
        method: 'POST',
        body: data
    });

    if (error.value) {
        console.log(error.value);
    }

    if (responseData.value.success) {
        return responseData.value.data;
    }
}


export async function getGroupData(data) {
    try {
        const response = await $fetch(`/api/groups/get?${data}`, {
            method: 'GET',
        });
        return response;

    } catch (error) {
        throw new Error('Failed to get GroupData');
    }
}


export async function deleteGroupData(data){
    const { data: responseData, error } = await useFetch('/api/groups/delete', {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });

    if (error.value) {
        console.log(error.value);
    }

    if (responseData.value && responseData.value.success) {
        return responseData.value.data;
    }
    return null;
}

export async function updateGroupMember(data) {
    try {
        const response = await fetch('/api/groups/put', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating group member:', error);
        return { success: false, error };
    }
}

export async function updateSingleMember(data) {
    try {
        const response = await fetch('/api/groups/put_members', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error removing group member:', error);
        return { success: false, error };
    }
}