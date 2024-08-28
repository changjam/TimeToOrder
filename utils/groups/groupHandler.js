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
