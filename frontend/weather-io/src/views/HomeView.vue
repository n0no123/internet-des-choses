<script setup lang="ts">
import AddSensorModal from '@/components/AddSensorModal.vue';
import ReleaseSensorModal from '@/components/ReleaseSensorModal.vue';
import SignOutModal from '@/components/SignOutModal.vue';
import router from '@/router';
import { useAccountStore } from '@/stores/account';
import { onMounted, onUnmounted, ref } from 'vue';
import { Chart, Grid, Line } from 'vue3-charts';

type Data = {
  temperature: number;
  humidity: number;
  timestamp: number;
}

type SensorData = {
  metrics: Array<Data>;
  previsions: Array<Data>
}

type ChartData = {
  timestamp: string;
  temperature: number;
  humidity: number;
}

const store = useAccountStore();

const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);

const intervalIds = ref<Array<number>>([]);

const selectedSerialNumber = ref<number>();

const sensorData = ref<Map<number, SensorData>>(new Map());
const metricsChartData = ref<Map<number, Array<ChartData>>>(new Map());
const previsionsChartData = ref<Map<number, Array<ChartData>>>(new Map());
const isClaimModalOpen = ref<boolean>(false);
const isReleaseModalOpen = ref<boolean>(false);
const isSignOutModalOpen = ref<boolean>(false);

const signOut = () => {
  intervalIds.value.map(intervalId => clearInterval(intervalId));
  store.account = { username: '', token: '' };
  store.sensors = [];
  router.push({ name: 'sign-in' });
}

const claimSensor = async (sensorId?: number) => {
  if (sensorId) {
    await fetch(`${import.meta.env.VITE_API_URL}/user/claim-sensor/${sensorId}`,
      {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${store.account.token}`
        },
      }
    ).then(async () => await lookupSensor());
  }
}

const releaseSensor = async (sensorId?: number) => {
  if (sensorId) {
    await fetch(`${import.meta.env.VITE_API_URL}/user/release-sensor/${sensorId}`,
      {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${store.account.token}`
        },
      }
    ).then(async () => await lookupSensor());
  }
}

const lookupSensor = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/sensor/lookup`,
    {
      headers: {
        'Authorization': `Bearer ${store.account.token}`
      },
    }
  )
    .then(response => { if (response.ok) return response.json() })
    .then(json => store.sensors = json.sensors)
  return response;
}

const getData = async (serialNumber: number) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/sensor/temperature-and-humidity/${serialNumber}`,
    {
      headers: {
        'Authorization': `Bearer ${store.account.token}`
      },
    }
  )
    .then(response => { if (response.ok) return response.json() })
  return response;
}

const loadData = async () => {
  store.sensors = await lookupSensor();
  store.sensors.map(async (sensor) => await getData(sensor.id).then((data) => sensorData.value.set(sensor.id, data)));

  setMockSensorData();

  sensorData.value.forEach((value, key) => {
    metricsChartData.value.set(key, value.metrics.slice(0, 12).map(e => ({ timestamp: new Date(e.timestamp).toISOString().slice(14, 19), temperature: e.temperature, humidity: e.humidity })));
    previsionsChartData.value.set(key, value.previsions.slice(0, 8).map(e => ({ timestamp: new Date(e.timestamp).toISOString().slice(11, 16), temperature: e.temperature, humidity: e.humidity })));
  });
}

loadData().then(() => fetchMockSensorData());

const setMockSensorData = () => {
  sensorData.value.set(1,
    {
      metrics: [
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 1000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 2000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 3000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 4000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 5000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 6000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 7000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 8000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 9000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 10000) },
        { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() + (10800 * 11000) },
      ],
      previsions: [
        { temperature: 10, humidity: 37, timestamp: new Date().getTime() },
        { temperature: 20, humidity: 12, timestamp: new Date().getTime() + (10800 * 1000) },
        { temperature: 15, humidity: 38, timestamp: new Date().getTime() + (10800 * 2000) },
        { temperature: 5, humidity: 29, timestamp: new Date().getTime() + (10800 * 3000) },
        { temperature: 25, humidity: 4, timestamp: new Date().getTime() + (10800 * 4000) },
        { temperature: 30, humidity: 11, timestamp: new Date().getTime() + (10800 * 5000) },
        { temperature: 15, humidity: 23, timestamp: new Date().getTime() + (10800 * 6000) },
        { temperature: 35, humidity: 16, timestamp: new Date().getTime() + (10800 * 7000) },
      ]
    }
  );
}

const fetchMockSensorData = () => {
  intervalIds.value.push(
    setInterval(() => {
      sensorData.value.set(1,
        {
          metrics: [
            ...sensorData.value.get(1)?.metrics ?? [],
            { temperature: Math.random() * 100, humidity: Math.random() * 100, timestamp: new Date().getTime() },
          ],
          previsions: [
            { temperature: 10, humidity: 37, timestamp: new Date().getTime() },
            { temperature: 20, humidity: 12, timestamp: new Date().getTime() + (10800 * 1000) },
            { temperature: 15, humidity: 38, timestamp: new Date().getTime() + (10800 * 2000) },
            { temperature: 5, humidity: 29, timestamp: new Date().getTime() + (10800 * 3000) },
            { temperature: 25, humidity: 4, timestamp: new Date().getTime() + (10800 * 4000) },
            { temperature: 30, humidity: 11, timestamp: new Date().getTime() + (10800 * 5000) },
            { temperature: 15, humidity: 23, timestamp: new Date().getTime() + (10800 * 6000) },
            { temperature: 35, humidity: 16, timestamp: new Date().getTime() + (10800 * 7000) },
          ]
        }
      );
      sensorData.value.forEach((value, key) => {
        metricsChartData.value.set(key, value.metrics.slice(value.metrics.length - 12, value.metrics.length).map(e => ({ timestamp: new Date(e.timestamp).toISOString().slice(14, 19), temperature: e.temperature, humidity: e.humidity })));
        previsionsChartData.value.set(key, value.previsions.slice(0, 8).map(e => ({ timestamp: new Date(e.timestamp).toISOString().slice(11, 16), temperature: e.temperature, humidity: e.humidity })));
      });
    }, 5000)
  );
}


const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

console.log(`token: ${JSON.stringify(store.account.token)}`);
</script>

<template>
  <div class="flex-h header">
    <h1 class="title">DASHBOARD</h1>
    <div class="flex-h action">
      <button class="button centered flex-h" @click="isClaimModalOpen = true"><v-icon class="icon"
          name="io-add-circle-outline" /></button>
      <button class="button centered" @click="isSignOutModalOpen = true">
        <v-icon class="icon" name="ri-logout-circle-r-line" />
      </button>
    </div>
  </div>

  <div v-for="(sensor, index) in store.sensors" :key="index">
    <div class="centered layout" :class="windowWidth < 900 ? 'flex-v' : 'flex-h'">

      <div class="flex-v centered">
        <div class="flex-h centered">
          <h2 class="humidity">Humidité</h2>
          <h2>/</h2>
          <h2 class="temperature">Température</h2>
        </div>
        <Chart :data="metricsChartData.get(sensor.id)" :size="{ width: windowWidth < 900 ? 400 : 800, height: 400 }"
          :margin="{ top: 0, right: 0, bottom: 0, left: 0 }">
          <template #layers>
            <Grid strokeDasharray="2,2" />
            <Line :dataKeys="['timestamp', 'temperature']" :lineStyle="{ stroke: 'red' }" />
            <Line :dataKeys="['timestamp', 'humidity']" type="step" />
          </template>
        </Chart>
        <h1 class="title">{{ `Sensor #${sensor.id} - Last Minute` }}</h1>
      </div>

      <button class="button centered" @click="selectedSerialNumber = sensor.id; isReleaseModalOpen = true">
        <v-icon class="icon" name="la-unlink-solid" />
      </button>

      <div class="flex-v centered">
        <div class="flex-h centered">
          <h2 class="humidity">Humidité</h2>
          <h2>/</h2>
          <h2 class="temperature">Température</h2>
        </div>
        <Chart :data="previsionsChartData.get(sensor.id)" :size="{ width: windowWidth < 900 ? 400 : 800, height: 400 }"
          :margin="{ top: windowWidth < 900 ? 30 : 0, right: 0, bottom: 0, left: 0 }">
          <template #layers>
            <Grid strokeDasharray="2,2" />
            <Line :dataKeys="['timestamp', 'temperature']" :lineStyle="{ stroke: 'red' }" />
            <Line :dataKeys="['timestamp', 'humidity']" type="step" />
          </template>
        </Chart>
        <h1 class="title">{{ `${new Date().toISOString().slice(0, 10)} - Daily Forecast` }}</h1>
      </div>

    </div>
  </div>

  <AddSensorModal v-if="isClaimModalOpen"
    @submit="(sensorId: number) => { claimSensor(sensorId); isClaimModalOpen = false }"
    @cancel="() => isClaimModalOpen = false" />
  <ReleaseSensorModal :serial-number="selectedSerialNumber" v-if="isReleaseModalOpen && selectedSerialNumber"
    @submit="(sensorId: number) => { releaseSensor(sensorId); isReleaseModalOpen = false }"
    @cancel="() => isReleaseModalOpen = false" />
  <SignOutModal v-if="isSignOutModalOpen" @submit="() => { signOut(); isSignOutModalOpen = false }"
    @cancel="() => isSignOutModalOpen = false" />
</template>

<style scoped lang="scss">
.header {
  justify-content: space-between;

  .title {
    color: var(--color-primary);
  }

  .action {
    gap: 1em;

    .button {
      align-self: center;
      background-color: var(--color-secondary-container);
      border: none;
      border-radius: 100%;
      cursor: pointer;
      height: 4em;
      width: 4em;

      &:hover {
        border: 0.2em solid var(--color-outline);
      }

      .icon {
        height: 1.75em;
        fill: var(--color-on-secondary-container);
        width: 1.75em;
      }
    }
  }
}

.layout {
  justify-content: space-around;


  .humidity {
    color: blue;
    margin-right: 1em;
  }

  .temperature {
    color: red;
    margin-left: 1em;
  }

  .button {
    align-self: center;
    background-color: var(--color-secondary-container);
    border: none;
    border-radius: 100%;
    cursor: pointer;
    height: 4em;
    width: 4em;

    &:hover {
      border: 0.2em solid var(--color-outline);
    }

    .icon {
      fill: var(--color-on-secondary-container);
    }
  }

  .title {
    color: var(--color-primary);
  }
}
</style>