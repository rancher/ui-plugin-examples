

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

    const namespace = 'default';
    const id = 'my-configmap';
    const namespacedId = `${namespace}/${id}`;
    const baseName = 'base-name';
    const updateName = 'update-name';
    const replaceName = 'replace-name';

    let singleItemData = ref(undefined);

    let findSingleItemData = ref(undefined);
    let allItemsData = ref(undefined);
    let updatedItemData = ref(undefined);
    let replacedItemData = ref(undefined);

    const parseData = (data) => {
      const parsedData = Array.isArray(data) ? data.map(item => ({ id: item.id, name: item.data?.name })) : { id: data.id, name: data.data?.name };
      return JSON.stringify(parsedData, null, 2);
    };

    const createData = async () => {
      singleItemData.value = await resources.cluster.create({
        type:     K8S.CONFIG_MAP,
        metadata: { name: id, namespace: namespace },
        data:     { name: baseName }
      });
    };

    const findData = async (populate = false) => {
      if (populate) {
        findSingleItemData.value = await resources.cluster.find(K8S.CONFIG_MAP, namespacedId);
      } else {
        singleItemData.value = await resources.cluster.find(K8S.CONFIG_MAP, namespacedId);
      }
    };

    const findAllData = async () => {
      allItemsData.value = await resources.cluster.findAll(K8S.CONFIG_MAP);
    };

    const updateData = async () => {
      updatedItemData.value = await resources.cluster.update(K8S.CONFIG_MAP, namespacedId, {
        data: {name: updateName}
      });
    };

    const replaceData = async () => {
      const dataToReplace = updatedItemData.value || findSingleItemData.value;

      dataToReplace.data = { name: replaceName };

      replacedItemData.value = await resources.cluster.replace(K8S.CONFIG_MAP, namespacedId, dataToReplace);
    };

    const deleteData = async () => {
      singleItemData.value = await resources.cluster.delete(K8S.CONFIG_MAP, namespacedId);

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
    <h2 class="mt-40">Cluster API</h2>
    <p>This section will demonstrate how to interact with the Cluster API.</p>
    <h3 class="mt-40">create() example - creating a new configmap</h3>
    <!-- CREATE -->
    <RcButton :disabled="singleItemData" primary class="mt-10" @click="createData">Create a configmap</RcButton>
    <h3 class="mt-40">find() example - finding a new configmap</h3>
    <!-- FIND -->
    <RcButton :disabled="!singleItemData" primary @click="findData(true)">Find a configmap</RcButton>
    <p v-if="!singleItemData">You'll need to create a configmap first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="findSingleItemData">{{ parseData(findSingleItemData) }}</p>
    <!-- FIND ALL -->
     <h3 class="mt-40">findAll() example - finding all configmaps</h3>
    <RcButton :disabled="!singleItemData" primary @click="findAllData">Find all configmaps</RcButton>
    <p v-if="!singleItemData">You'll need to create a configmap first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="allItemsData">{{ parseData(allItemsData) }}</p>
        <!-- UPDATE -->
    <h3 class="mt-40">update() example - updating a configmap  (HTTP PATCH OP)</h3>
    <RcButton :disabled="!singleItemData" primary @click="updateData(true)">Update a configmap</RcButton>
    <p v-if="!singleItemData">You'll need to create a configmap first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="updatedItemData">{{ parseData(updatedItemData) }}</p>
        <!-- REPLACE -->
    <h3 class="mt-40">replace() example - replacing a configmap  (HTTP PUT OP)</h3>
    <RcButton :disabled="!singleItemData" primary @click="replaceData(true)">Replace a configmap</RcButton>
    <p v-if="!singleItemData">You'll need to create a configmap first. Perform the create() example</p>
    <p v-if="singleItemData" class="mt-10 mb-10">Result will appear below this:</p>
    <p v-if="replacedItemData">{{ parseData(replacedItemData) }}</p>
    <!-- DELETE -->
    <h3 class="mt-40">delete() example - deleting a configmap</h3>
    <RcButton :disabled="!singleItemData" primary @click="deleteData">Delete a configmap</RcButton>
    <p v-if="!singleItemData">You'll need to create a configmap first. Perform the create() example</p>

  </div>
</template>

<style lang="scss" scoped>
</style>