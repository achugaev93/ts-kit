import {Dispatcher} from '../../../Source/Events/Dispatcher';
import {ActionListener, ActionListenerCancel} from '../../../Source/Events/types';


describe('Dispatcher', () => {
    let dispatcher: Dispatcher;
    let listener: ActionListener;
    let cancel: ActionListenerCancel;
    let cancelResult: boolean;
    let testAction: object = {
        type: 'test'
    };


    beforeEach(() => {
        expect(function () {
            dispatcher = new Dispatcher();
        }).not.toThrow();
    });


    describe('#constructor()', () => {
        it('create new instance of Dispatcher class', () => {
            expect(dispatcher).toBeInstanceOf(Dispatcher);
        });
    });


    describe('#addListener()', () => {
        it('attaches listener', () => {
            listener = jest.fn();

            expect(function () {
                dispatcher.addListener(listener);
            }).not.toThrow();
        });


        it('returns cancellation function', () => {
            listener = jest.fn();

            expect(function () {
                cancel = dispatcher.addListener(listener);
            }).not.toThrow();

            expect(typeof cancel).toBe('function');

            // Cancellation function returns `true` when listener was un-subscribed.

            expect(function () {
                cancelResult = cancel();
            }).not.toThrow();

            expect(cancelResult).toEqual(true);

            // Cancellation function returns `false` if listener was already un-subscribed.

            expect(function () {
                cancelResult = cancel();
            }).not.toThrow();

            expect(cancelResult).toEqual(false);
        });
    });


    describe('#removeListener()', () => {
        it('returns `true` when listener was un-subscribed', () => {
            listener = jest.fn();

            dispatcher.addListener(listener);

            expect(function () {
                cancelResult = dispatcher.removeListener(listener);
            }).not.toThrow();

            expect(cancelResult).toEqual(true);
        });


        it('return `false` if listener was already un-subscribed', () => {
            listener = jest.fn();

            dispatcher.addListener(listener);
            dispatcher.removeListener(listener);

            expect(function () {
                cancelResult = dispatcher.removeListener(listener);
            }).not.toThrow();

            expect(cancelResult).toEqual(false);
        });


        it('return `false` if listener was not subscribed', () => {
            listener = jest.fn();

            expect(function () {
                cancelResult = dispatcher.removeListener(listener);
            }).not.toThrow();

            expect(cancelResult).toEqual(false);
        });
    });


    describe('#dispatchAction()', () => {
        it('trigger all listeners with specified action', () => {
            listener = jest.fn();

            dispatcher.addListener(listener);

            expect(function () {
                dispatcher.dispatchAction(testAction);
            }).not.toThrow();

            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(testAction);
        });
    });
});
