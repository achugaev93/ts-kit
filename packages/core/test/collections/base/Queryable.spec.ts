import {
    Grouping, IgnoreCaseComparator,
    IgnoreCaseEqualityComparator,
    IndexOutOfBoundsException,
    InvalidOperationException,
    NamedPool,
    Queryable,
    RangeException,
    Sequence,
    SortOrder
} from '../../..';
import {testSequence} from './Sequence.spec';


interface Book {
    authors: Queryable<string>;
}


export function assertLengthAndIsEmpty<I>(items: Queryable<I>, expectedLength: number): void {
    expect(items.length).toBe(expectedLength);
    expect(items.isEmpty).toBe(expectedLength === 0);
}

export function testQueryable(create: <T>(items?: Sequence<T>) => Queryable<T>) {
    describe('Queryable', function () {
        testSequence(create);

        describe('isEmpty', function () {
            it('should be true when collection is empty', function () {
                const empty = create([]);
                const notEmpty = create(['a', 'b']);

                assertLengthAndIsEmpty(empty, 0);
                assertLengthAndIsEmpty(notEmpty, 2);
            });
        });

        describe('aggregate()', function () {
            it('should aggregate list data into new value', function () {
                const list: Queryable<string> = create([
                    'one',
                    'two',
                    'three'
                ]);
                const map: NamedPool<boolean> = list.aggregate((obj: NamedPool<boolean>, item: string): NamedPool<boolean> => {
                    obj[item] = true;

                    return obj;
                }, {});

                expect(map).toEqual({
                    one: true,
                    two: true,
                    three: true
                });
            });
        });

        describe('all()', function () {
            it('should determine whether all elements of a sequence satisfy a condition', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.all((word: string): boolean => {
                    return word.length >= 3;
                })).toBe(true);

                expect(list.all((word: string): boolean => {
                    return word.length < 5;
                })).toBe(false);
            });

            it('should throw if list is empty', function () {
                const list: Queryable<string> = create();

                expect(() => {
                    list.all((): boolean => {
                        return true;
                    });
                }).toThrow(InvalidOperationException);
            });
        });

        describe('any()', function () {
            it('should determine whether any of elements satisfy a condition', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.any((word: string): boolean => {
                    return word.length === 3;
                })).toBe(true);

                expect(list.any((word: string): boolean => {
                    return word.length === 5;
                })).toBe(true);
            });

            it('should throw if list is empty', function () {
                const list: Queryable<string> = create();

                expect(() => {
                    list.any((): boolean => {
                        return true;
                    });
                }).toThrow(InvalidOperationException);
            });
        });

        describe('average()', function () {
            it('should calculate average value', function () {
                const list: Queryable<string> = create(['one', 'two', 'six']);

                expect(list.average((word: string): number => {
                    return word.length;
                })).toBe(3);
            });

            it('should throw if list is empty', function () {
                const list: Queryable<string> = create();

                expect(() => {
                    list.average((): number => {
                        return 0;
                    });
                }).toThrow(InvalidOperationException);
            });
        });

        describe('concat()', function () {
            it('should return concatenation of lists', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.concat(create(['four', 'five'])).toArray()).toEqual(['one', 'two', 'three', 'four', 'five']);
                expect(list.length).toBe(3);
            });
        });

        describe('contains()', function () {
            it('should determine whether collection contains specified item', function () {
                const source: Queryable<string> = create(['one', 'two']);

                expect(source.contains('one')).toBe(true);
                expect(source.contains('two')).toBe(true);
                expect(source.contains('three')).toBe(false);
            });

            it('should determine whether collection contains specified item using custom equality comparator', function () {
                const source: Queryable<string> = create(['one', 'two', 'THREE']);

                expect(source.contains('One', IgnoreCaseEqualityComparator.get())).toBe(true);
                expect(source.contains('TWO', IgnoreCaseEqualityComparator.get())).toBe(true);
                expect(source.contains('three', IgnoreCaseEqualityComparator.get())).toBe(true);
            });
        });

        describe('count()', function () {
            it('should calculates count of items matching predicate', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.count((word: string): boolean => {
                    return word.length > 3;
                })).toBe(1);
            });
        });

        describe('distinct()', function () {
            it('should return list of distinct items', function () {
                const list: Queryable<string> = create(['one', 'two', 'One']);
                const distinctItems: Queryable<string> = list.distinct(IgnoreCaseEqualityComparator.get());

                expect(list.length).toBe(3);
                expect(list.toArray()).toEqual(['one', 'two', 'One']);

                expect(distinctItems.length).toBe(2);
                expect(distinctItems.toArray()).toEqual(['one', 'two']);
            });
        });

        describe('equals()', function () {
            it('should compare empty lists', function () {
                const list: Queryable<string> = create();

                expect(list.equals([])).toBe(true);
            });

            it('should compares lists using default equality comparator', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.equals(['one', 'two', 'three'])).toBe(true);
                expect(list.equals(['ONE', 'TWO'])).toBe(false);
                expect(list.equals(['ONE', 'TWO', 'THREE'])).toBe(false);
            });

            it('should compare lists using custom equality comparator', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.equals(['one', 'two', 'three'], IgnoreCaseEqualityComparator.get())).toBe(true);
                expect(list.equals(['ONE', 'TWO'], IgnoreCaseEqualityComparator.get())).toBe(false);
                expect(list.equals(['ONE', 'TWO', 'THREE'], IgnoreCaseEqualityComparator.get())).toBe(true);
            });
        });

        describe('except()', function () {
            it('should return list without specified items using custom comparator', function () {
                const list: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const filteredList: Queryable<string> = list.except(['one', 'Five'], IgnoreCaseEqualityComparator.get());

                expect(filteredList).not.toEqual(list);
                expect(filteredList.toArray()).toEqual(['two', 'Three', 'Five']);
            });

            it('should return list without specified items using default comparator', function () {
                const source: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const filteredList1: Queryable<string> = source.except(['Three']);

                expect(filteredList1).not.toEqual(source);
                expect(filteredList1.toArray()).toEqual(['two', 'ONE', 'one', 'One']);

                const filteredList2: Queryable<string> = source.except(['Five']);

                expect(filteredList2).not.toEqual(source);
                expect(filteredList2.toArray()).toEqual(['two', 'ONE', 'one', 'Three', 'One', 'Five']);
            });
        });

        describe('first()', function () {
            it('should return first item matching predicate', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.first((word: string): boolean => {
                    return word.length === 3;
                })).toBe('one');

                expect(list.first((word: string): boolean => {
                    return word.length === 4;
                })).toBe(undefined);

                expect(list.first((word: string): boolean => {
                    return word.length === 4;
                }, 'fallback')).toBe('fallback');
            });
        });

        describe('firstOrDefault()', function () {
            it('should return fallback value if list is empty', function () {
                const list: Queryable<string> = create();

                expect(list.firstOrDefault('fallback')).toBe('fallback');
            });

            it('should return first item of list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.firstOrDefault('fallback')).toBe('one');
            });
        });

        describe('forEach()', function () {
            it('should iterate over list', function () {
                const list: Queryable<string> = create(['one', 'two']);
                const fn: jest.Mock = jest.fn();

                list.forEach(fn);

                expect(fn).toHaveBeenCalledTimes(2);
            });
        });

        describe('groupBy()', function () {
            it('should return list of grouped items using custom comparator', function () {
                const list: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const groups: Array<Grouping<string, string>> = list.groupBy((word: string): string => {
                    return word[0].toLowerCase();
                }, IgnoreCaseEqualityComparator.get()).toArray();

                expect(groups.length).toBe(2);
                expect(groups[0].key).toBe('t');
                expect(groups[0].toArray()).toEqual(['two', 'Three']);
                expect(groups[1].key).toBe('o');
                expect(groups[1].toArray()).toEqual(['ONE', 'one', 'One']);
            });

            it('should return list of grouped items using default comparator', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                const groups: Array<Grouping<number, string>> = list.groupBy((word: string): number => {
                    return word.length;
                }).toArray();

                expect(groups.length).toBe(2);
                expect(groups[0].key).toBe(3);
                expect(groups[0].toArray()).toEqual(['one', 'two']);
                expect(groups[1].key).toBe(5);
                expect(groups[1].toArray()).toEqual(['three']);
            });
        });

        describe('intersect()', function () {
            it('should return list without specified items using custom comparator', function () {
                const list: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const filteredList: Queryable<string> = list.intersect(create(['one', 'Five']), IgnoreCaseEqualityComparator.get());

                expect(filteredList).not.toEqual(list);
                expect(filteredList.toArray()).toEqual(['ONE', 'one', 'One']);
            });

            it('should return list without specified items using default comparator', function () {
                const list: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                let filteredList: Queryable<string> = list.intersect(create(['Three', 'Four']));

                expect(filteredList).not.toEqual(list);
                expect(filteredList.toArray()).toEqual(['Three']);

                filteredList = list.intersect(create(['Five']));

                expect(filteredList).not.toEqual(list);
                expect(filteredList.toArray()).toEqual([]);
            });
        });

        describe('join()', function () {
            it('should join lists using custom equality comparator', function () {
                const listA: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const listB: Queryable<string> = create(['Ten', 'Once', 'Twelve']);
                const combo: Queryable<string[]> = listA.join(listB, (word: string): string => {
                    return word[0];
                }, (word: string): string => {
                    return word[0];
                }, function (x: string, y: string): string[] {
                    return [x, y];
                }, IgnoreCaseEqualityComparator.get());

                expect(combo.toArray()).toEqual([
                    ['two', 'Ten'],
                    ['two', 'Twelve'],
                    ['ONE', 'Once'],
                    ['one', 'Once'],
                    ['Three', 'Ten'],
                    ['Three', 'Twelve'],
                    ['One', 'Once']
                ]);
            });
        });

        describe('last()', function () {
            it('should return last item matching predicate', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.last((word: string): boolean => {
                    return word.length === 3;
                })).toBe('two');

                expect(list.last((word: string): boolean => {
                    return word.length === 4;
                })).toBe(undefined);

                expect(list.last((word: string): boolean => {
                    return word.length === 4;
                }, 'fallback')).toBe('fallback');
            });
        });

        describe('lastOrDefault()', function () {
            it('should return fallback value if list is empty', function () {
                const list: Queryable<string> = create();

                expect(list.lastOrDefault('fallback')).toBe('fallback');
            });

            it('should return last item of list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.lastOrDefault('fallback')).toBe('three');
            });
        });

        describe('max()', function () {
            it('should return maximal value', function () {
                const list: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);

                expect(list.max((word: string): number => {
                    return word.length;
                })).toBe(5);
            });

            it('should throw if list is empty', function () {

                const list: Queryable<string> = create();

                expect(() => {
                    list.max((word: string): number => {
                        return word.length;
                    });
                }).toThrow(InvalidOperationException);
            });
        });

        describe('min()', function () {
            it('should return minimal value', function () {
                const list: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);

                expect(list.min((word: string): number => {
                    return word.length;
                })).toBe(3);
            });

            it('should throw if list is empty', function () {
                const list: Queryable<string> = create();

                expect(() => {
                    list.min((word: string): number => {
                        return word.length;
                    });
                }).toThrow(InvalidOperationException);
            });
        });

        describe('orderBy()', function () {
            it('should return sorted list using ascending sort order', function () {
                const originalList: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const orderedList: Queryable<string> = originalList.orderBy((word: string): string => {
                    return word.slice(0, 2);
                }, IgnoreCaseComparator.get(), SortOrder.ASCENDING);

                expect(orderedList.toArray()).toEqual([
                    'ONE', 'one', 'One', 'Three', 'two'
                ]);
            });

            it('should return sorted list using custom no sort order', function () {
                const originalList: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const orderedList: Queryable<string> = originalList.orderBy((word: string): string => {
                    return word.slice(0, 2);
                }, IgnoreCaseComparator.get(), SortOrder.NONE);

                expect(orderedList.toArray()).toEqual([
                    'two', 'ONE', 'one', 'Three', 'One'
                ]);
            });

            it('should return sorted list using descending sort order', function () {
                const originalList: Queryable<string> = create(['two', 'ONE', 'one', 'Three', 'One']);
                const orderedList: Queryable<string> = originalList.orderBy((word: string): string => {
                    return word.slice(0, 2);
                }, IgnoreCaseComparator.get(), SortOrder.DESCENDING);

                expect(orderedList.toArray()).toEqual([
                    'two', 'Three', 'ONE', 'one', 'One'
                ]);
            });
        });

        describe('reverse()', function () {
            it('should return reversed list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);
                const reversedList: Queryable<string> = list.reverse();

                expect(reversedList.toArray()).toEqual(['three', 'two', 'one']);
            });
        });

        describe('map()', function () {
            it('should return list of selected values', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                const firstChars: Queryable<string> = list.map((word: string): string => {
                    return word[0];
                });

                expect(firstChars.length).toBe(3);
                expect(firstChars.toArray()).toEqual(['o', 't', 't']);
            });
        });

        describe('selectMany()', function () {
            it('should return list of selected values', function () {
                const books: Queryable<Book> = create([
                    {
                        authors: create([
                            'Johan Rowling'
                        ])
                    },
                    {
                        authors: create([
                            'Steve MacConnell',
                            'Kent Beck'
                        ])
                    }
                ]);

                const authorNames: Queryable<string> = books.selectMany<string, string>((book: Book): Queryable<string> => {
                    return book.authors;
                }, (book: Book, authorFullName: string): string => {
                    return authorFullName.split(' ')[0];
                });

                expect(authorNames.length).toBe(3);

                expect(authorNames.toArray()).toEqual([
                    'Johan', 'Steve', 'Kent'
                ]);
            });
        });

        describe('skip()', function () {
            it('should return slice of list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.skip(1).toArray()).toEqual(['two', 'three']);
            });

            it('should throw if offset is out of bounds', function () {
                const list: Queryable<string> = create();

                list.skip(0);

                expect(() => {
                    list.skip(1);
                }).toThrow(IndexOutOfBoundsException);

                expect(() => {
                    list.skip(-10);
                }).toThrow(IndexOutOfBoundsException);
            });
        });

        describe('skipWhile()', function () {
            it('should returns slice of list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);
                const slice: Queryable<string> = list.skipWhile((word: string): boolean => {
                    return word[0] !== 't';
                });

                expect(slice.toArray()).toEqual(['two', 'three']);
            });

            it('should works with empty lists', function () {
                const list: Queryable<string> = create();
                const slice: Queryable<string> = list.skipWhile((word: string): boolean => {
                    return word[0] !== 't';
                });

                expect(slice.toArray()).toEqual([]);
            });
        });

        describe('slice()', function () {
            it('should return slice of list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.slice(1, 1).toArray()).toEqual(['two']);
                expect(list.slice(2, 1).toArray()).toEqual(['three']);
                expect(list.slice(1, 2).toArray()).toEqual(['two', 'three']);
            });

            it('should throw if slice range is invalid', function () {
                const list: Queryable<string> = create();

                expect(() => {
                    list.slice(0, 1);
                }).toThrow(RangeException);
                expect(() => {
                    list.slice(-1, 0);
                }).toThrow(IndexOutOfBoundsException);
            });

            it('should works with empty lists', function () {
                const list: Queryable<string> = create();

                expect(list.slice(0, 0).toArray()).toEqual([]);
            });
        });

        describe('take()', function () {
            it('should return slice of list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.take(2).toArray()).toEqual(['one', 'two']);
            });

            it('should throw if length is out of bounds', function () {
                const list: Queryable<string> = create();

                list.take(0);

                expect(() => {
                    list.take(1);
                }).toThrow(RangeException);

                expect(() => {
                    list.take(-10);
                }).toThrow(RangeException);
            });

            it('should return slice of list', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);
                const slice: Queryable<string> = list.takeWhile((word: string): boolean => {
                    return word[0] !== 't';
                });

                expect(slice.toArray()).toEqual(['one']);
            });
        });

        describe('takeWhile()', function () {
            it('should work with empty lists', function () {
                const list: Queryable<string> = create();
                const slice: Queryable<string> = list.takeWhile((word: string): boolean => {
                    return word[0] !== 't';
                });

                expect(slice.toArray()).toEqual([]);
            });
        });

        describe('union()', function () {
            it('should return union of lists', function () {
                const listA: Queryable<string> = create(['one', 'two', 'three']);
                const listB: Queryable<string> = create([
                    'four', 'one', 'two', 'three', 'five'
                ]);
                const union: Queryable<string> = listA.union(listB);

                expect(union.length).toBe(5);
                expect(union.toArray()).toEqual([
                    'one', 'two', 'three', 'four', 'five'
                ]);
                expect(listA.length).toBe(3);
            });
        });

        describe('findAll()', function () {
            it('should return list of items for whose predicate function returned `true`', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                const wordsOfThreeChars: Queryable<string> = list.findAll((word: string): boolean => {
                    return word.length === 3;
                });

                expect(wordsOfThreeChars.length).toBe(2);
                expect(wordsOfThreeChars.toArray()).toEqual(['one', 'two']);
            });
        });

        describe('zip()', function () {
            it('should return list of combined items', function () {
                const listA: Queryable<string> = create(['one', 'two', 'three']);
                const listB: Queryable<string> = create(['four', 'five']);
                const listC: Queryable<string> = create(['four', 'five', 'six', 'seven']);
                const comboAB: Queryable<string> = listA.zip(listB, (x: string, y: string): string => {
                    return `${x}+${y}`;
                });
                const comboAC: Queryable<string> = listA.zip(listC, (x: string, y: string): string => {
                    return `${x}+${y}`;
                });

                expect(comboAB.toArray()).toEqual([
                    'one+four', 'two+five'
                ]);

                expect(comboAC.toArray()).toEqual([
                    'one+four', 'two+five', 'three+six'
                ]);
            });
        });

        describe('toJSON()', function () {
            it('should serialize list to pure array', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.toJSON() instanceof Array).toBe(true);
                expect(list.toJSON()).toEqual(['one', 'two', 'three']);
            });
        });

        describe('toArray()', function () {
            it('should return pure array', function () {
                const list: Queryable<string> = create(['one', 'two', 'three']);

                expect(list.toArray() instanceof Array).toBe(true);
                expect(list.toArray()).toEqual(['one', 'two', 'three']);
            });
        });

    });
}
