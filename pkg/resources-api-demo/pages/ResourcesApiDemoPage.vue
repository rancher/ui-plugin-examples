

<script>
import { ref, onMounted } from 'vue';

import RcButton from '@components/RcButton/RcButton.vue';
import { useResources, K8S } from '@shell/apis';

export default {
  components: {
    RcButton,
  },
  setup () {
    const resources = useResources();

    const id = 'my-new-user';
    const baseName = 'base-name';
    const updateName = 'update-name';
    const replaceName = 'replace-name';

    let singleItemData = ref(undefined);

    let findSingleItemData = ref(undefined);
    let allItemsData = ref(undefined);
    let updatedItemData = ref(undefined);
    let replacedItemData = ref(undefined);

    const parseData = (data) => {
      const parsedData = Array.isArray(data) ? data.map(item => ({ id: item.id, username: item.username })) : { id: data.id, username: data.username };
      return JSON.stringify(parsedData, null, 2);
    };

    const createData = async () => {
      singleItemData.value = await resources.mgmt.create({
        type:     K8S.USER,
        metadata: { name: id },
        username: baseName
      });
    };

    const findData = async (populate = false) => {
      if (populate) {
        findSingleItemData.value = await resources.mgmt.find(K8S.USER, id);
      } else {
        singleItemData.value = await resources.mgmt.find(K8S.USER, id);
      }
    };

    const findAllData = async () => {
      allItemsData.value = await resources.mgmt.findAll(K8S.USER);
    };

    const updateData = async () => {
      updatedItemData.value = await resources.mgmt.update(K8S.USER, id, {
        username: updateName
      });
    };

    const replaceData = async () => {
      const dataToReplace = updatedItemData.value || findSingleItemData.value;

      dataToReplace.username = replaceName;

      replacedItemData.value = await resources.mgmt.replace(K8S.USER, id, dataToReplace);
    };

    const deleteData = async () => {
      singleItemData.value = await resources.mgmt.delete(K8S.USER, id);

      singleItemData.value = undefined;
      findSingleItemData.value = undefined;
      allItemsData.value = undefined;
      updatedItemData.value = undefined;
      replacedItemData.value = undefined;
    };

    onMounted(findData);

    return {
      singleItemData,
      findSingleItemData,
      allItemsData,
      updatedItemData,
      replacedItemData,
      parseData,
      createData,
      findData,
      findAllData,
      updateData,
      replaceData,
      deleteData      
    }
  }
}
</script>

<template>
  <div>
    <h2 class="mt-40">Management API</h2>
    <p>This section will demonstrate how to interact with the Management API.</p>
    <h3 class="mt-40">create() example - creating a new user</h3>
    <!-- CREATE -->
    <RcButton :disabled="singleItemData" primary class="mt-10" @click="createData">Create a user</RcButton>
    <h3 class="mt-40">find() example - finding a new user</h3>
    <!-- FIND -->
    <RcButton :disabled="!singleItemData" primary @click="findData(true)">Find a user</RcButton>
    <p v-if="!singleItemData">You'll need to create a user first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="findSingleItemData">{{ parseData(findSingleItemData) }}</p>
    <!-- FIND ALL -->
     <h3 class="mt-40">findAll() example - finding all users</h3>
    <RcButton :disabled="!singleItemData" primary @click="findAllData">Find all users</RcButton>
    <p v-if="!singleItemData">You'll need to create a user first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="allItemsData">{{ parseData(allItemsData) }}</p>
        <!-- UPDATE -->
    <h3 class="mt-40">*** PROBLEMS! *** update() example - updating a user  (HTTP PATCH OP)</h3>
    <RcButton :disabled="!singleItemData" primary @click="updateData(true)">Update a user</RcButton>
    <p v-if="!singleItemData">You'll need to create a user first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="updatedItemData">{{ parseData(updatedItemData) }}</p>
        <!-- REPLACE -->
    <h3 class="mt-40">** USERNAME IS IMMUTABLE, BUT IT WORKS ** replace() example - replacing a user  (HTTP PUT OP)</h3>
    <RcButton :disabled="!singleItemData" primary @click="replaceData(true)">Replace a user</RcButton>
    <p v-if="!singleItemData">You'll need to create a user first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="replacedItemData">{{ parseData(replacedItemData) }}</p>
    <!-- DELETE -->
    <h3 class="mt-40">delete() example - deleting a user</h3>
    <RcButton :disabled="!singleItemData" primary @click="deleteData">Delete a user</RcButton>
    <p v-if="!singleItemData">You'll need to create a user first. Perform the create() example</p>

  </div>
</template>

<style lang="scss" scoped>
</style>