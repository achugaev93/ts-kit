import {Assert} from '../../Assertion/Assert';
import {ArrayList} from '../../../collections/main/ArrayList';
import {List} from '../../../collections-core/main/List';
import {InvalidArgumentException} from '../../main/exceptions/InvalidArgumentException';


export class ListGenerator {
    public static range(start: number, end: number, step: number = 1): List<number> {
        Assert.range(start, end).bounds();

        if (step === 0) {
            throw new InvalidArgumentException('step', `Step cannot be equal to zero.`);
        }

        const list: ArrayList<number> = new ArrayList<number>();

        for (let num = start; num < end; num += step) {
            list.add(num);
        }

        return list;
    }


    public static repeat<TValue>(value: TValue, times: number): List<TValue> {
        Assert.argument('times', times).isLength();

        const list: ArrayList<TValue> = new ArrayList<TValue>();

        for (let index = 0; index < times; index++) {
            list.add(value);
        }

        return list;
    }


    public static generate<TValue>(generator: (index: number) => TValue, length: number): List<TValue> {
        Assert.argument('length', length).isLength();

        const list: ArrayList<TValue> = new ArrayList<TValue>();

        for (let i = 0; i < length; i++) {
            list.add(generator(i));
        }

        return list;
    }
}
