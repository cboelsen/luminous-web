import {
    convertParamsForDjangoRestFramework,
    createUrl,
    dispatchify,
    stringContainsInvalidChars,
} from './index';


describe('utils.index:stringContainsInvalidChars', () => {
    it('should find invalid characters when present', () => {
        expect(stringContainsInvalidChars('abc*')).toEqual(true);
    });

    it('should not find invalid characters when not present', () => {
        expect(stringContainsInvalidChars('abc')).toEqual(false);
    });

    it('should consider no string to be valid', () => {
        expect(stringContainsInvalidChars()).toEqual(false);
    });
});


describe('utils.index:dispatchify', () => {
    function fn1(a) {
        return a;
    }
    function fn2(a, b) {
        return a + b;
    }
    const dispatch = (val) => {return val + 1;};
    const fns = dispatchify(fn1, fn2)(dispatch);

    it('should return a dict with function names as keys', () => {
        expect('fn1' in fns).toEqual(true);
        expect('fn2' in fns).toEqual(true);
        expect('fnX' in fns).toEqual(false);
    });

    it('should wrap the given functions with dispatch', () => {
        expect(fns.fn1(5)).toEqual(6);
        expect(fns.fn1(2)).toEqual(3);
        expect(fns.fn2(2, 3)).toEqual(6);
    });
});


describe('utils.index:createUrl', () => {
    it('should return a URL representing the passed in string', () =>{
        expect(createUrl('http://blah')).toEqual(new URL('http://blah'));
        expect(createUrl('http://blah', {})).toEqual(new URL('http://blah'));
    });

    // TODO: node.js does not implement `URL.searchParams` yet, so can't test.
    //it('should append query parameters to the URL', () =>{
    //    const params = {key1: 'val1', key2: 'val2'}
    //    expect(createUrl('http://blah', params)).toEqual(new URL('http://blah'));
    //});
});


describe('utils.api:convertParamsForDjangoRestFramework', () => {
    it('should not change strings or numbers', () => {
        const params = {key1: 'val1', key2: 2};
        expect(
            convertParamsForDjangoRestFramework(params)
        ).toEqual(
            params
        );
    });

    it('should convert true to "True" and false to "False"', () => {
        const params = {key1: 'val1', key2: 2, key3: true, key4: false};
        const expected = {key1: 'val1', key2: 2, key3: 'True', key4: 'False'};
        expect(
            convertParamsForDjangoRestFramework(params)
        ).toEqual(
            expected
        );
    });
});
