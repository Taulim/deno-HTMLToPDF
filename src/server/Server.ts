import { OakContext, OakApplication, OakRouter } from '../common/Dependency.ts';

enum Method {
	Convert = 'convert',
}

type APIParams = {
	method: Method;
};

type ServerInputConvert = {
	Markdown: object;
};

type ServerResponseOK = {
	Blob: string | object;
};

type ServerResponseError = {
	Error: true;
	Message: string;
};

type ServerResponse = ServerResponseOK | ServerResponseError;

export function ServerInit(application: OakApplication) {
	const router = new OakRouter();
	router.get('/api', async (context) => {
		context.response.body = null;
	});
	router.post('/api/:method', async (context) => {
		const params = context.params as APIParams;
		switch (params.method) {
			case 'convert': {
				return await ServerConvert(context);
				break;
			}
			default: {
				context.response.status = 404;
				context.response.body = null;
				break;
			}
		}
	});
	application.use(router.routes());
	application.use(router.allowedMethods());
}

async function ServerConvert(context: OakContext) {
	try {
		if (!context.request.hasBody) {
			throw new Error('Request has no body');
		}
		const body = context.request.body({ type: 'text' });
		const value = await body.value;
		let objInfo = null;
		try {
			objInfo = JSON.parse(value) as ServerInputConvert;
		} catch (ex) {
			throw new Error('Invalid request');
		}
		const rawMarkdown = objInfo.Markdown;
		//
		// TODO: Convert markdown
		//
		context.response.body = {
			Blob: 'This is a test :: ' + JSON.stringify(rawMarkdown),
		} as ServerResponse;
	} catch (ex) {
		context.response.status = 500;
		context.response.body = {
			Error: true,
			Message: ex.message,
		} as ServerResponse;
	}
}
