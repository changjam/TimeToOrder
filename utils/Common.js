import { getGroupData } from './groups/groupHandler'

export const getGroupByUserID = async (userInfo) => {
    try {
        const _joinedGroups = userInfo.joinedGroups;
        const _groupList = []

        if (!_joinedGroups || _joinedGroups.length < 1) return _groupList

        for (const group of _joinedGroups) {
            const _groupdata = await getGroupData(`_id=${group}`);
            _groupList.push(_groupdata.data);
        }
        return _groupList
    } catch (error) {
        console.error(error)
    }
}