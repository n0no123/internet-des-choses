<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import { ref } from 'vue';
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

const sensorId = ref<number>();
const sensorData = ref<Map<number, SensorData>>(new Map());
const metricsChartData = ref<Map<number, Array<ChartData>>>(new Map());
const previsionsChartData = ref<Map<number, Array<ChartData>>>(new Map());

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
    metricsChartData.value.set(key, value.metrics.slice(0, 8).map(e => ({ timestamp: new Date(e.timestamp).toISOString().slice(11, 19), temperature: e.temperature, humidity: e.humidity })));
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
      metricsChartData.value.set(key, value.metrics.slice(value.metrics.length - 8, value.metrics.length).map(e => ({ timestamp: new Date(e.timestamp).toISOString().slice(11, 19), temperature: e.temperature, humidity: e.humidity })));
      previsionsChartData.value.set(key, value.previsions.slice(0, 8).map(e => ({ timestamp: new Date(e.timestamp).toISOString().slice(11, 16), temperature: e.temperature, humidity: e.humidity })));
    });
  }, 5000);
}

console.log(`token: ${JSON.stringify(store.account.token)}`);
</script>

<template>
  <h1>DASHBOARD</h1>
  <form action="/user" method="get" class="flex-v">
    <label>Sensor Id</label>
    <input type="number" v-model="sensorId" />
    <button class="button" type="button" @click="claimSensor(sensorId)">Claim!</button>
  </form>
  <div v-for="(sensor, index) in store.sensors" :key="index" class="flex-h centered">
    <Chart :data="metricsChartData.get(sensor.id)" :margin="{ left: 0, top: 20, right: 0, bottom: 0 }"
      :size="{ width: 800, height: 400 }">
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Line :dataKeys="['timestamp', 'temperature']" :lineStyle="{ stroke: 'red' }" />
        <Line :dataKeys="['timestamp', 'humidity']" type="step" />
      </template>
    </Chart>
    <Chart :data="previsionsChartData.get(sensor.id)" :margin="{ left: 0, top: 20, right: 0, bottom: 0 }"
      :size="{ width: 400, height: 400 }">
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Line :dataKeys="['timestamp', 'temperature']" :lineStyle="{ stroke: 'red' }" />
        <Line :dataKeys="['timestamp', 'humidity']" type="step" />
      </template>
    </Chart>
  </div>
</template>

<style lang="scss">
.layout {
  display: grid;
  gap: 2em;
  grid-template-columns: repeat(auto-fit, minmax(21.5em, 1fr));
  margin: auto;
  max-width: 75%;
  padding-top: 2em;
  place-items: center;
}
</style>