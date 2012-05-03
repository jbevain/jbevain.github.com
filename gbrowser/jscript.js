/**
 * Copyright (c) 2004, Evain Jb (jb@evain.net)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     - Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     - Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     - Neither the name of Evain Jb nor the names of its contributors may
 *       be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * Bibliotheque rajoutant des fonctionnalités au langage Javascript
 * @author jbe
 *
 *****************************************************************************/

/**
 * Constantes
 */
TYPE_BOOLEAN = "boolean";
TYPE_NUMBER = "number";
TYPE_FUNCTION = "function";
TYPE_STRING = "string";
TYPE_OBJECT = "object";
TYPE_UNDEFINED = "undefined";

METHOD_CLONE = "clone";

TRUE = "true";
FALSE = "false";
NULL = "null";

/**
* Clone l'object
*/
Object.prototype.clone = function() {
    var nObj = new Object();
    for (var slot in this) {
        if (slot != METHOD_CLONE) {
            var type = typeof(this[slot]);
            switch (type.toString()) {
                case TYPE_BOOLEAN :
                case TYPE_NUMBER :
                case TYPE_FUNCTION :
                    nObj[slot] = this[slot];
                    break;
                case TYPE_STRING :
                    nObj[slot] = new String(this[slot]);
                    break;
                case TYPE_OBJECT :
                    if (this[slot] != null) {
                        if (this[slot] instanceof Array ||
                            this[slot] instanceof Date) {
                                
                            nObj[slot] = this[slot].clone();
                        } else {
                            nObj[slot] = this[slot];
                        }
                    } else {
                        nObj[slot] = null;
                    }
                case TYPE_UNDEFINED :
                default :
                    continue;
            }
        }
    }
    return nObj;
}

/**
* Constante chaine vide
*/
String.empty = "";

/**
* Formate une chaine de caractère
*/
String.format = function() {
    if (arguments.length == 0) return String.empty;
    else if (arguments.length == 1) return arguments[0];
    else {
        var ret = arguments[0];
        for (var i = 1 ; i < arguments.length ; i++) {
            ret = ret.replace(new RegExp("\{" + (i - 1) + "\}", "gim"), arguments[i].toString());
        }
        return ret;
    }
}

/**
* Teste si la chaine commence par le parametre
*/
String.prototype.startsWith = function(str) {
    return str != null && str != String.empty && !this.indexOf(str);
}

/**
* Teste si la chaine fini par le parametre
*/
String.prototype.endsWith = function(str) {
    var index = this.lastIndexOf(str);
    return str != null && str != String.empty &&
        index != -1 && index + str.length == this.length;
}

/**
* Supprime les espaces en debut et fin de la chaine
*/
String.prototype.trim = function() {
    return this.replace(/^\s*([\s\S]*\S+)\s*$|^\s*$/, '$1');
}

/**
* Parse la chaine en un booleen
*/
String.prototype.toBoolean = function() {
    return this.toLowerCase() == TRUE;
}

/**
* Retourne la position de la premiere occurence de la valeur
* sinon -1
*/
Array.prototype.indexOf = function(value) {
    var length = this.length;
        for (var i = 0 ; i < length ; i++)
            if (this[i] == value )
                return i;
    return -1;
}

/**
* Retourne la position de la derniere occurence de la valeur
* sinon -1
*/
Array.prototype.lastIndexOf = function(value) {
    var length = this.length;
        for (var i = length - 1 ; i >= 0 ; i--)
            if (this[i] == value)
                return i;
    return -1;
}

/**
* Teste la présence d'une valeur dans un tableau
*/
Array.prototype.contains = function(value) {
    return this.indexOf(value) != -1;
}

/**
* Supprime un indice du tableau
* Plus efficace que delete car resize le tableau
*/
Array.prototype.removeAt = function(index) {
    if (index >= 0 && index <= (this.length / 2)) {
        for (var i = index ; i >= 0 ; i--) {
            if (i != 0) {
                this[i] = this[i - 1];
            } else {
                this.shift();
                return true;
            }
        }
    } else if (index > (this.length / 2)) {
        for (var i = index ; i < this.length ; i++) {
            if (i != (this.length - 1)) {
                this[i] = this[i + 1];
            } else {
                this.pop();
                return true;
            }
        }
    }
    return false;
}

/**
* Supprime la valeur du tableau
*/
Array.prototype.remove = function(valeur) {
    while (this.indexOf(valeur) != -1)
        if (!this.removeAt(this.indexOf(valeur)))
            return false;
    return true;
}

/**
* Renvoie la dernière valeur du tableau
*/
Array.prototype.peek = function() {
    return this[this.length - 1];
}

/**
* Appelle une fonction pour chaque element
* du tableau
*/
Array.prototype.each = function(functor) {
    for (var i = 0 ; i < this.length ; i++) {
        functor(this[i]);
    }
}

/**
* Equivalent du each avec l'index passé
*/
Array.prototype.eachWithIndex = function(functor) {
    for (var i = 0 ; i < this.length ; i++) {
        functor(this[i], i);
    }
}

/**
* Clone le tableau
*/
Array.prototype.clone = function() {
    var length = this.length;
    var nAry = new Array(length);
    for (var i = 0 ; i < length ; i++)
        nAry[i] = this[i];
    return nAry;
}

/**
 * Clone la date
 */
Date.prototype.clone = function() {
    return new Date(this.getTime());
}

/**
 * Hashtable : tableau associatif
 */
function Hashtable() {

    this.container = new Object();

    /**
    * Rajoute une valeur pour la clef
    */
    this.put = function(key, value) {
        this.container[key] = value;
    }

    /**
    * Retourne la valeur pour la clef
    */
    this.get = function(key) {
        return this.container[key];
    }
    
    /**
    * Retourne la taille de la hashtable
    */
    this.size = function() {
        var i = 0;
        for (var slot in this.container)
            if (slot != METHOD_CLONE)
                i++;
        return i;
    }
    
    this.length = this.size;

    /**
    * Teste la présence d'une clef dans la hashtable
    */
    this.containsKey = function(key) {
        return this.container.hasOwnProperty(key);
    }

    /**
    * Teste la présence d'une valeur dans la hashtable
    */
    this.containsValue = function(value) {
        for (var slot in this.container)
            if (slot != METHOD_CLONE && this.container[slot] == value)
                return true;
        return false;
    }

    /**
    * Teste la présence d'un couple clef valeur dans la hashtable
    */
    this.contains = function(key, value) {
        return this.container[key] == value;
    }

    /**
    * Retourne un tableau des clefs
    */
    this.getKeys = function() {
        var keys = new Array();
        for (var slot in this.container)
            if (slot != METHOD_CLONE)
                keys.push(slot);
        return keys;
    }

    /**
    * Retourne un tableau des valeurs
    */
    this.getValues = function() {
        var values = new Array();
        for (var slot in this.container)
            if (slot != METHOD_CLONE)
                values.push(this.container[slot]);
        return values;
    }
    
    /**
    * Appelle une fonction pour chaque
    * paire de clef/valeur
    */
    this.each = function(functor) {
        for (var slot in this.container) {
            if (slot != METHOD_CLONE) {
                functor(slot, this.container[slot]);
            }
        }
    }
}
