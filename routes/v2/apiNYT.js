// eslint-disable-next-line new-cap
const router = require('express').Router();
const { nytCounties, nytStates, nytNationwide } = require('../../utils/apiNYTHelper');
const { redis, keys } = require('../../routes/instances');

router.get('/v2/nyt/states', async (req, res) => {
	const { lastdays } = req.query;
	res.send(await nytStates(lastdays, keys.nyt_states, redis));
});

router.get('/v2/nyt/states/:state', async (req, res) => {
	const { state: queryState } = req.params;
	const { lastdays } = req.query;
	const data = await nytStates(lastdays, keys.nyt_states, redis);
	if (queryState) {
		const stateArr = queryState.trim().split(/,[\s+]?/).map((state) => state.toLowerCase());
		const stateData = data.filter(({ state }) => stateArr.includes(state.toLowerCase()));
		// eslint-disable-next-line no-unused-expressions
		stateData.length > 0
			? res.send(stateData)
			: res.status(404).send({ message: 'State not found or no data found for state' });
	} else {
		res.send(data);
	}
});

router.get('/v2/nyt/counties', async (req, res) => {
	const { lastdays } = req.query;
	res.send(await nytCounties(lastdays, keys.nyt_counties, redis));
});

router.get('/v2/nyt/counties/:county', async (req, res) => {
	const { county: queryCounty } = req.params;
	const { lastdays } = req.query;
	const data = await nytCounties(lastdays, keys.nyt_counties, redis);
	if (queryCounty) {
		const countyArr = queryCounty.trim().split(/,[\s+?]/).map((county) => county.toLowerCase());
		const countyData = data.filter(({ county }) => countyArr.includes(county.toLowerCase()));
		// eslint-disable-next-line no-unused-expressions
		countyData.length > 0
			? res.send(countyData)
			: res.status(404).send({ message: 'County not found or no data found for county' });
	} else {
		res.send(data);
	}
});

router.get('/v2/nyt/usa', async (req, res) => {
	const { lastdays } = req.query;
	res.send(await nytNationwide(lastdays, keys.nyt_USA, redis))
});

module.exports = router;
