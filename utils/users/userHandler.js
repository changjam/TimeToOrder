export async function getUserData(data) {
    try {
        const response = await $fetch('/api/users/get', {
            method: 'GET',
            params: data
        });

        return response;

    } catch (error) {
        throw new Error('Failed to get UserData');
    }
}
