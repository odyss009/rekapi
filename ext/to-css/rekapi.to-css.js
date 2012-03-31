;(function (Rekapi, Mustache, global) {

  // CONSTANTS
  //
  var DEFAULT_GRANULARITY = 100;
  var VENDOR_PREFIXES = Rekapi.util.VENDOR_PREFIXES = {
    'microsoft': '-ms-'
    ,'mozilla': '-moz-'
    ,'opera': '-o-'
    ,'w3': ''
    ,'webkit': '-webkit-'
  };


  // TEMPLATES
  //

  /**
   * [0]: vendor
   * [1]: animation name
   * [2]: keyframes
   */
  var KEYFRAME_TEMPLATE = [
    '@%skeyframes %s-keyframes {'
    ,'%s'
    ,'}'
  ].join('\n');


  // PROTOTYPE EXTENSIONS
  //
  /**
   * @param {Object} opts
   */
  Rekapi.prototype.toCSS = function (opts) {
    var actorIds = this.getActorIds();

    _.each(actorIds, function (id) {
      this.getActor(id).toCSS();
    }, this);
  };


  /**
   * @param {Object} opts
   */
  Rekapi.Actor.prototype.toCSS = function (opts) {
    opts = opts || {};
    var granularity = opts.granularity || DEFAULT_GRANULARITY;
    var keyframes = generateActorKeyframes(this, granularity);
    console.log(keyframes);
  };


  // UTILITY FUNCTIONS
  //
  /**
   * @param {Rekapi.Actor} actor
   */
  function serializeActorStep (actor) {
    var serializedProps = ['{'];
    _.each(actor.get(), function (val, key) {
      serializedProps.push(key + ':' + val + ';');
    });

    serializedProps.push('}');
    return serializedProps.join('');
  };


  /**
   * @param {Rekapi.Actor} actor
   * @param {number} granularity
   */
  function generateActorKeyframes (actor, granularity) {
    var animLength = actor.kapi.animationLength();
    var i = 0;
    var serializedFrames = [];
    var percent, stepPrefix;

    for (i; i <= animLength; i += animLength / granularity) {
      actor.calculatePosition(i);
      percent = ((i * granularity) / animLength);
      if (percent === 0) {
        stepPrefix = 'from ';
      } else if (percent === 100) {
        stepPrefix = 'to ';
      } else {
        stepPrefix = percent + '% ';
      }
      serializedFrames.push(stepPrefix + serializeActorStep(actor));
    }

    return serializedFrames.join('\n');
  }


  function applyVendorBoilerplate (vendors, toKeyframes) {

  }


  /**
   * @param {string} formatter
   * @param {[string]} args
   */
  var printf = Rekapi.util.printf = function (formatter, args) {
    var composedStr = formatter;
    _.each(args, function (arg) {
      composedStr = composedStr.replace('%s', arg);
    });

    return composedStr;
  };

} (this.Rekapi, this.Mustache, this));
