const axios = require('axios');

const BaseUrl = 'https://farsite.online/api/1.0/';

const Planets = [ 'HOM-14', 'HOM-11', 'CETO-2', 'TIHO-1', 'HIP-32', 'GAEA-22', 'NEX-3', 'NYX-1' ];

const getResources = async () => {
  try {
    const { data: { Resources } } = await axios.get(BaseUrl + '/config');
    return Resources;
  } catch (error) {
    console.error(error);
  }
}

const getPlanetSectors = async (planetName) => {
  try {
    const { data } = await axios.get(BaseUrl + '/universe/planets/' + planetName + '/sectors/');
    return data;
  } catch (error) {
    console.error(error);
  }
}

const main = async () => {
  const resourceDetails = await getResources();
  const totalResources = new Array(157).fill(0);

  const promises = [];
  Planets.forEach(planet => {
    promises.push(getPlanetSectors(planet))
  })

  const planetDetails = await Promise.all(promises);
  planetDetails.forEach(planet => {
    planet.forEach(({ resources }) => {
      const { spots, deposits } = resources;
      const sectorResources = spots.concat(deposits);
      sectorResources.forEach(res => totalResources[res]++);
    })
  })

  const mappedTotalResources = resourceDetails.reduce((acc, { code, id }) => {
    return (totalResources[id] > 0) ? [...acc, {[code]: totalResources[id]}] : acc;
  }, [])

  mappedTotalResources.forEach(res => {
    const [ code, amount ] = Object.entries(res)[0];
    console.log(`${code}, ${amount},`);
  });
}

main();