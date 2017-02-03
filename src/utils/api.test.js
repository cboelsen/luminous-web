import fetchMock from 'fetch-mock';

import Api from './api';


describe('utils.api:Api', () => {
    it('should handle GET requests with params', async () => {
        const params = {blah: 1, clah: 'some'};
        const result = {photo: 1};
        fetchMock.getOnce(/.*\/photos\/\?blah=1&clah=some$/, result);

        const json = await Api.get('/photos/', params);
        expect(json).toEqual(result);
        fetchMock.restore();
    });

    it('should handle GET requests without params', async () => {
        const result = {photo: 1};
        fetchMock.getOnce(/.*\/photos\/$/, result);

        const json = await Api.get('/photos/');
        expect(json).toEqual(result);
        fetchMock.restore();
    });

    it('should handle POST requests', async () => {
        const data = {path: 'some/path', rating: 50};
        const result = Object.assign({url: '/1/2/3/'}, data);
        fetchMock.postOnce(
            function(url, opts) {
                const body = JSON.parse(opts.body);
                return (
                    url.toString().match(/.*\/photos\/1\/$/) !== null &&
                    opts && opts.body &&
                    body.path == data.path &&
                    body.rating == data.rating
                );
            },
            result
        );

        const json = await Api.post('/photos/1/', null, data);
        expect(json).toEqual(result);
        fetchMock.restore();
    });

    it('should handle PUT requests', async () => {
        const data = {path: 'some/path', rating: 50};
        const result = Object.assign({url: '/1/2/3/'}, data);
        fetchMock.putOnce(
            function(url, opts) {
                const body = JSON.parse(opts.body);
                return (
                    url.toString().match(/.*\/photos\/1\/$/) !== null &&
                    opts && opts.body &&
                    body.path == data.path &&
                    body.rating == data.rating
                );
            },
            result
        );

        const json = await Api.put('/photos/1/', null, data);
        expect(json).toEqual(result);
        fetchMock.restore();
    });

    it('should handle PATCH requests', async () => {
        const data = {path: 'some/path', rating: 50};
        const result = Object.assign({url: '/1/2/3/'}, data);
        fetchMock.patchOnce(
            function(url, opts) {
                const body = JSON.parse(opts.body);
                return (
                    url.toString().match(/.*\/photos\/1\/$/) !== null &&
                    opts && opts.body &&
                    body.path == data.path &&
                    body.rating == data.rating
                );
            },
            result
        );

        const json = await Api.patch('/photos/1/', null, data);
        expect(json).toEqual(result);
        fetchMock.restore();
    });

    it('should handle POST requests with token', async () => {
        const data = {path: 'some/path', rating: 50};
        const result = Object.assign({url: '/1/2/3/'}, data);
        fetchMock.postOnce(
            function(url, opts) {
                const body = JSON.parse(opts.body);
                return (
                    url.toString().match(/.*\/photos\/1\/$/) !== null &&
                    opts.headers.Authorization === "Token 1234567890" &&
                    opts && opts.body &&
                    body.path === data.path &&
                    body.rating === data.rating
                );
            },
            result
        );

        const json = await Api.post('/photos/1/', '1234567890', data);
        expect(json).toEqual(result);
        fetchMock.restore();
    });

    it('should handle DELETE requests', async () => {
        const result = {};
        fetchMock.deleteOnce(/.*\/photos\/1\/$/, result);

        const json = await Api.delete('/photos/1/');
        expect(json).toEqual(result);
        fetchMock.restore();
    });

    it('should handle failing GET requests', async () => {
        const response = {
            status: 404,
            body: {photo: 1},
        };
        fetchMock.getOnce(/.*\/photos\/$/, response);

        try {
            await Api.get('/photos/');
        } catch (error) {
            expect(error.message).toEqual('Not Found');
            expect(error.response.status).toEqual(404);
        }
        fetchMock.restore();
    });
});
