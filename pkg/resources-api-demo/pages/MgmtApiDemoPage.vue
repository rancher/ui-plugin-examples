

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

    const RESOURCE_TYPE = 'catalog.cattle.io.clusterrepo';

    const id = 'my-new-repo';
    const baseName = 'https://example.com';
    const updateName = 'https://example-update.com';
    const replaceName = 'https://example-replace.com';

    let singleItemData = ref(undefined);

    let findSingleItemData = ref(undefined);
    let allItemsData = ref(undefined);
    let updatedItemData = ref(undefined);
    let replacedItemData = ref(undefined);

    const parseData = (data) => {
      const parsedData = Array.isArray(data) ? data.map(item => ({ id: item.id, url: item.spec?.url })) : { id: data.id, url: data.spec?.url };
      return JSON.stringify(parsedData, null, 2);
    };

    const createData = async () => {
      singleItemData.value = await resources.mgmt.create({
        type:     RESOURCE_TYPE,
        metadata: { name: id },
        spec: { url: baseName }
      });
    };

    const findData = async (populate = false) => {
      if (populate) {
        findSingleItemData.value = await resources.mgmt.find(RESOURCE_TYPE, id);
      } else {
        singleItemData.value = await resources.mgmt.find(RESOURCE_TYPE, id);
      }
    };

    const findAllData = async () => {
      allItemsData.value = await resources.mgmt.findAll(RESOURCE_TYPE);
    };

    const updateData = async () => {
      updatedItemData.value = await resources.mgmt.update(RESOURCE_TYPE, id, {
        spec: { url: updateName }
      });
    };

    const replaceData = async () => {
      const currentData = await resources.mgmt.find(RESOURCE_TYPE, id);

      currentData.spec.url = replaceName;

      replacedItemData.value = await resources.mgmt.replace(RESOURCE_TYPE, id, currentData);
    };

    const deleteData = async () => {
      singleItemData.value = await resources.mgmt.delete(RESOURCE_TYPE, id);

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
    <h3 class="mt-40">create() example - creating a new cluster repo</h3>
    <!-- CREATE -->
    <RcButton :disabled="singleItemData" primary class="mt-10" @click="createData">Create a cluster repo</RcButton>
    <h3 class="mt-40">find() example - finding a new cluster repo</h3>
    <!-- FIND -->
    <RcButton :disabled="!singleItemData" primary @click="findData(true)">Find a cluster repo</RcButton>
    <p v-if="!singleItemData">You'll need to create a cluster repo first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="findSingleItemData">{{ parseData(findSingleItemData) }}</p>
    <!-- FIND ALL -->
     <h3 class="mt-40">findAll() example - finding all cluster repos</h3>
    <RcButton :disabled="!singleItemData" primary @click="findAllData">Find all cluster repos</RcButton>
    <p v-if="!singleItemData">You'll need to create a cluster repo first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="allItemsData">{{ parseData(allItemsData) }}</p>
        <!-- UPDATE -->
    <h3 class="mt-40">update() example - updating a cluster repo  (HTTP PATCH OP)</h3>
    <RcButton :disabled="!singleItemData" primary @click="updateData(true)">Update a cluster repo</RcButton>
    <p v-if="!singleItemData">You'll need to create a cluster repo first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="updatedItemData">{{ parseData(updatedItemData) }}</p>
        <!-- REPLACE -->
    <h3 class="mt-40">replace() example - replacing a cluster repo  (HTTP PUT OP)</h3>
    <RcButton :disabled="!singleItemData" primary @click="replaceData(true)">Replace a cluster repo</RcButton>
    <p v-if="!singleItemData">You'll need to create a cluster repo first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="replacedItemData">{{ parseData(replacedItemData) }}</p>
    <!-- DELETE -->
    <h3 class="mt-40">delete() example - deleting a cluster repo</h3>
    <RcButton :disabled="!singleItemData" primary @click="deleteData">Delete a cluster repo</RcButton>
    <p v-if="!singleItemData">You'll need to create a cluster repo first. Perform the create() example</p>

  </div>
</template>

<style lang="scss" scoped>
</style>