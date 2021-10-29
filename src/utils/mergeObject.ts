// @ts-nocheck
/** Used as references for various `Number` constants. */
const MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * isObjectLike({})
 * // => true
 *
 * isObjectLike([1, 2, 3])
 * // => true
 *
 * isObjectLike(Function)
 * // => false
 *
 * isObjectLike(null)
 * // => false
 */
function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * isObject({})
 * // => true
 *
 * isObject([1, 2, 3])
 * // => true
 *
 * isObject(Function)
 * // => true
 *
 * isObject(null)
 * // => false
 */
function isObject(value) {
    const type = typeof value;
    return value != null && (type === "object" || type === "function");
}

/** Detect free variable `global` from Node.js. */
const freeGlobal =
    typeof global === "object" &&
    global !== null &&
    global.Object === Object &&
    global;

/** Detect free variable `globalThis` */
const freeGlobalThis =
    typeof globalThis === "object" &&
    globalThis !== null &&
    globalThis.Object == Object &&
    globalThis;

/** Detect free variable `self`. */
const freeSelf =
    typeof self === "object" && self !== null && self.Object === Object && self;

/** Used as a reference to the global object. */
const root =
    freeGlobalThis || freeGlobal || freeSelf || Function("return this")();

/** Used to detect unsigned integer values. */
const reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `exports`. */
const freeExports =
    typeof exports === "object" &&
    exports !== null &&
    !exports.nodeType &&
    exports;

/** Detect free variable `module`. */
const freeModule =
    freeExports &&
    typeof module === "object" &&
    module !== null &&
    !module.nodeType &&
    module;

/** Detect the popular CommonJS extension `module.exports`. */
const moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
const Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * isBuffer(new Buffer(2))
 * // => true
 *
 * isBuffer(new Uint8Array(2))
 * // => false
 */
const isBuffer = nativeIsBuffer || (() => false);

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
    const type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return (
        !!length &&
        (type === "number" || (type !== "symbol" && reIsUint.test(value))) &&
        value > -1 &&
        value % 1 == 0 &&
        value < length
    );
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * const object = { 'a': 1 }
 * const other = { 'a': 1 }
 *
 * eq(object, object)
 * // => true
 *
 * eq(object, other)
 * // => false
 *
 * eq('a', 'a')
 * // => true
 *
 * eq('a', Object('a'))
 * // => false
 *
 * eq(NaN, NaN)
 * // => true
 */
function eq(value, other) {
    return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * isLength(3)
 * // => true
 *
 * isLength(Number.MIN_VALUE)
 * // => false
 *
 * isLength(Infinity)
 * // => false
 *
 * isLength('3')
 * // => false
 */
function isLength(value) {
    return (
        typeof value === "number" &&
        value > -1 &&
        value % 1 == 0 &&
        value <= MAX_SAFE_INTEGER
    );
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * isArrayLike([1, 2, 3])
 * // => true
 *
 * isArrayLike(document.body.children)
 * // => true
 *
 * isArrayLike('abc')
 * // => true
 *
 * isArrayLike(Function)
 * // => false
 */
function isArrayLike(value) {
    return (
        value != null && typeof value !== "function" && isLength(value.length)
    );
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */

function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
        return false;
    }
    const type = typeof index;
    if (
        type === "number"
            ? isArrayLike(object) && isIndex(index, object.length)
            : type === "string" && index in object
    ) {
        return eq(object[index], value);
    }
    return false;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
    if (key == "__proto__") {
        Object.defineProperty(object, key, {
            configurable: true,
            enumerable: true,
            value: value,
            writable: true,
        });
    } else {
        object[key] = value;
    }
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
    if (
        (value !== undefined && !eq(object[key], value)) ||
        (value === undefined && !(key in object))
    ) {
        baseAssignValue(object, key, value);
    }
}

/** Detect free variable `process` from Node.js. */
const freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
const nodeTypes = (() => {
    try {
        /* Detect public `util.types` helpers for Node.js v10+. */
        /* Node.js deprecation code: DEP0103. */
        const typesHelper =
            freeModule &&
            freeModule.require &&
            freeModule.require("util").types;
        return typesHelper
            ? typesHelper
            : /* Legacy process.binding('util') for Node.js earlier than v10. */
              freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {}
})();

/** Used to match `toStringTag` values of typed arrays. */
const reTypedTag =
    /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;

/* Node.js helper references. */
const nodeIsTypedArray = nodeTypes && nodeTypes.isTypedArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function getTag(value) {
    if (value == null) {
        return value === undefined ? "[object Undefined]" : "[object Null]";
    }
    return Object.prototype.toString.call(value);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * isTypedArray(new Uint8Array)
 * // => true
 *
 * isTypedArray([])
 * // => false
 */
const isTypedArray = nodeIsTypedArray
    ? (value) => nodeIsTypedArray(value)
    : (value) => isObjectLike(value) && reTypedTag.test(getTag(value));

/**
 * This method is like `isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * isArrayLikeObject([1, 2, 3])
 * // => true
 *
 * isArrayLikeObject(document.body.children)
 * // => true
 *
 * isArrayLikeObject('abc')
 * // => false
 *
 * isArrayLikeObject(Function)
 * // => false
 */
function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array?) {
    let index = -1;
    const length = source.length;

    array || (array = new Array(length));
    while (++index < length) {
        array[index] = source[index];
    }
    return array;
}

const allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
        return buffer.slice();
    }
    const length = buffer.length;
    const result = allocUnsafe
        ? allocUnsafe(length)
        : new buffer.constructor(length);

    buffer.copy(result);
    return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
    const result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
    const buffer = isDeep
        ? cloneArrayBuffer(typedArray.buffer)
        : typedArray.buffer;
    return new typedArray.constructor(
        buffer,
        typedArray.byteOffset,
        typedArray.length
    );
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1
 * }
 *
 * isPlainObject(new Foo)
 * // => false
 *
 * isPlainObject([1, 2, 3])
 * // => false
 *
 * isPlainObject({ 'x': 0, 'y': 0 })
 * // => true
 *
 * isPlainObject(Object.create(null))
 * // => true
 */
function isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) != "[object Object]") {
        return false;
    }
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object, else `false`.
 * @example
 *
 * isArguments(function() { return arguments }())
 * // => true
 *
 * isArguments([1, 2, 3])
 * // => false
 */
function isArguments(value) {
    return isObjectLike(value) && getTag(value) == "[object Arguments]";
}

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2
 * }
 *
 * Foo.prototype.c = 3
 *
 * assign({ 'a': 1 }, new Foo)
 * // => { 'a': 1, 'b': 2 }
 *
 * assign({ 'a': 1 }, toPlainObject(new Foo))
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
    value = Object(value);
    const result = {};
    for (const key in value) {
        result[key] = value[key];
    }
    return result;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
    const Ctor = value && value.constructor;
    const proto = (typeof Ctor === "function" && Ctor.prototype) || objectProto;

    return value === proto;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
    return typeof object.constructor === "function" && !isPrototype(object)
        ? Object.create(Object.getPrototypeOf(object))
        : {};
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(
    object,
    source,
    key,
    srcIndex,
    mergeFunc,
    customizer,
    stack
) {
    const objValue = object[key];
    const srcValue = source[key];
    const stacked = stack.get(srcValue);

    if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
    }
    let newValue = customizer
        ? customizer(objValue, srcValue, `${key}`, object, source, stack)
        : undefined;

    let isCommon = newValue === undefined;

    if (isCommon) {
        const isArr = Array.isArray(srcValue);
        const isBuff = !isArr && isBuffer(srcValue);
        const isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
            if (Array.isArray(objValue)) {
                newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
                newValue = copyArray(objValue);
            } else if (isBuff) {
                isCommon = false;
                newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
                isCommon = false;
                newValue = cloneTypedArray(srcValue, true);
            } else {
                newValue = [];
            }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
            } else if (typeof objValue === "function" || !isObject(objValue)) {
                newValue = initCloneObject(srcValue);
            }
        } else {
            isCommon = false;
        }
    }
    if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
    }
    assignMergeValue(object, key, newValue);
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
    let { length } = array;
    while (length--) {
        if (eq(array[length][0], key)) {
            return length;
        }
    }
    return -1;
}

/** Used to stand-in for `undefined` hash values. */
const HASH_UNDEFINED = "__lodash_hash_undefined__";

class ListCache {
    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    constructor(entries) {
        let index = -1;
        const length = entries == null ? 0 : entries.length;

        this.clear();
        while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
        }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @memberOf ListCache
     */
    clear() {
        this.__data__ = [];
        this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    delete(key) {
        const data = this.__data__;
        const index = assocIndexOf(data, key);

        if (index < 0) {
            return false;
        }
        const lastIndex = data.length - 1;
        if (index == lastIndex) {
            data.pop();
        } else {
            data.splice(index, 1);
        }
        --this.size;
        return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    get(key) {
        const data = this.__data__;
        const index = assocIndexOf(data, key);
        return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    has(key) {
        return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    set(key, value) {
        const data = this.__data__;
        const index = assocIndexOf(data, key);

        if (index < 0) {
            ++this.size;
            data.push([key, value]);
        } else {
            data[index][1] = value;
        }
        return this;
    }
}

class Hash {
    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    constructor(entries) {
        let index = -1;
        const length = entries == null ? 0 : entries.length;

        this.clear();
        while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
        }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @memberOf Hash
     */
    clear() {
        this.__data__ = Object.create(null);
        this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @memberOf Hash
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    delete(key) {
        const result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    get(key) {
        const data = this.__data__;
        const result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    has(key) {
        const data = this.__data__;
        return data[key] !== undefined;
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    set(key, value) {
        const data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = value === undefined ? HASH_UNDEFINED : value;
        return this;
    }
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData({ __data__ }, key) {
    const data = __data__;
    return isKeyable(key)
        ? data[typeof key === "string" ? "string" : "hash"]
        : data.map;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
    const type = typeof value;
    return type === "string" ||
        type === "number" ||
        type === "symbol" ||
        type === "boolean"
        ? value !== "__proto__"
        : value === null;
}

class MapCache {
    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    constructor(entries) {
        let index = -1;
        const length = entries == null ? 0 : entries.length;

        this.clear();
        while (++index < length) {
            const entry = entries[index];
            this.set(entry[0], entry[1]);
        }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @memberOf MapCache
     */
    clear() {
        this.size = 0;
        this.__data__ = {
            hash: new Hash(),
            map: new Map(),
            string: new Hash(),
        };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    delete(key) {
        const result = getMapData(this, key)["delete"](key);
        this.size -= result ? 1 : 0;
        return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    get(key) {
        return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    has(key) {
        return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    set(key, value) {
        const data = getMapData(this, key);
        const size = data.size;

        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
    }
}

class Stack {
    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    constructor(entries) {
        const data = (this.__data__ = new ListCache(entries));
        this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @memberOf Stack
     */
    clear() {
        this.__data__ = new ListCache();
        this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    delete(key) {
        const data = this.__data__;
        const result = data["delete"](key);

        this.size = data.size;
        return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    get(key) {
        return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    has(key) {
        return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    set(key, value) {
        let data = this.__data__;
        if (data instanceof ListCache) {
            const pairs = data.__data__;
            if (pairs.length < 200 - 1) {
                pairs.push([key, value]);
                this.size = ++data.size;
                return this;
            }
            data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
    }
}

/**
 * The base implementation of `merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(
    object: ILooseObject,
    source: ILooseObject,
    srcIndex: number,
    customizer?,
    stack?
) {
    if (object === source) {
        return;
    }
    baseFor(
        source,
        (srcValue, key) => {
            if (isObject(srcValue)) {
                stack || (stack = new Stack());
                baseMergeDeep(
                    object,
                    source,
                    key,
                    srcIndex,
                    baseMerge,
                    customizer,
                    stack
                );
            } else {
                let newValue = customizer
                    ? customizer(
                          object[key],
                          srcValue,
                          `${key}`,
                          object,
                          source,
                          stack
                      )
                    : undefined;

                if (newValue === undefined) {
                    newValue = srcValue;
                }
                assignMergeValue(object, key, newValue);
            }
        },
        keysIn
    );
}

/**
 * Creates a function like `assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
    return (object, ...sources) => {
        let index = -1;
        let length = sources.length;
        let customizer = length > 1 ? sources[length - 1] : undefined;
        const guard = length > 2 ? sources[2] : undefined;

        customizer =
            assigner.length > 3 && typeof customizer === "function"
                ? (length--, customizer)
                : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined : customizer;
            length = 1;
        }
        object = Object(object);
        while (++index < length) {
            const source = sources[index];
            if (source) {
                assigner(object, source, index, customizer);
            }
        }
        return object;
    };
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
    const result = [];
    for (const key in object) {
        result.push(key);
    }
    return result;
}
/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
function baseFor(object, iteratee, keysFunc) {
    const iterable = Object(object);
    const props = keysFunc(object);
    let { length } = props;
    let index = -1;

    while (length--) {
        const key = props[++index];
        if (iteratee(iterable[key], key, iterable) === false) {
            break;
        }
    }
    return object;
}

/**
 * This method is like `assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * const object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * }
 *
 * const other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * }
 *
 * merge(object, other)
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
const merge = createAssigner((object, source, srcIndex) => {
    baseMerge(object, source, srcIndex);
});

export default merge;
