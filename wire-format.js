exports.encodeType = {
  initial_feed: 0,
  live_feed: 1,
};

exports.decodeType = {
  0: 'initial_feed',
  1: 'live_feed',
};

exports.encodeLTPC = function (message) {
  var bb = popByteBuffer();
  _encodeLTPC(message, bb);
  return toUint8Array(bb);
};

function _encodeLTPC(message, bb) {
  // optional double ltp = 1;
  var $ltp = message.ltp;
  if ($ltp !== undefined) {
    writeVarint32(bb, 9);
    writeDouble(bb, $ltp);
  }

  // optional int64 ltt = 2;
  var $ltt = message.ltt;
  if ($ltt !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $ltt);
  }

  // optional int64 ltq = 3;
  var $ltq = message.ltq;
  if ($ltq !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $ltq);
  }

  // optional double cp = 4;
  var $cp = message.cp;
  if ($cp !== undefined) {
    writeVarint32(bb, 33);
    writeDouble(bb, $cp);
  }
}

exports.decodeLTPC = function (binary) {
  return _decodeLTPC(wrapByteBuffer(binary));
};

function _decodeLTPC(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional double ltp = 1;
      case 1: {
        message.ltp = readDouble(bb);
        break;
      }

      // optional int64 ltt = 2;
      case 2: {
        message.ltt = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 ltq = 3;
      case 3: {
        message.ltq = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional double cp = 4;
      case 4: {
        message.cp = readDouble(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeMarketLevel = function (message) {
  var bb = popByteBuffer();
  _encodeMarketLevel(message, bb);
  return toUint8Array(bb);
};

function _encodeMarketLevel(message, bb) {
  // repeated Quote bidAskQuote = 1;
  var array$bidAskQuote = message.bidAskQuote;
  if (array$bidAskQuote !== undefined) {
    for (var i = 0; i < array$bidAskQuote.length; i++) {
      var value = array$bidAskQuote[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeQuote(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

exports.decodeMarketLevel = function (binary) {
  return _decodeMarketLevel(wrapByteBuffer(binary));
};

function _decodeMarketLevel(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Quote bidAskQuote = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.bidAskQuote || (message.bidAskQuote = []);
        values.push(_decodeQuote(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeMarketOHLC = function (message) {
  var bb = popByteBuffer();
  _encodeMarketOHLC(message, bb);
  return toUint8Array(bb);
};

function _encodeMarketOHLC(message, bb) {
  // repeated OHLC ohlc = 1;
  var array$ohlc = message.ohlc;
  if (array$ohlc !== undefined) {
    for (var i = 0; i < array$ohlc.length; i++) {
      var value = array$ohlc[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeOHLC(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

exports.decodeMarketOHLC = function (binary) {
  return _decodeMarketOHLC(wrapByteBuffer(binary));
};

function _decodeMarketOHLC(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated OHLC ohlc = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.ohlc || (message.ohlc = []);
        values.push(_decodeOHLC(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeQuote = function (message) {
  var bb = popByteBuffer();
  _encodeQuote(message, bb);
  return toUint8Array(bb);
};

function _encodeQuote(message, bb) {
  // optional int32 bq = 1;
  var $bq = message.bq;
  if ($bq !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($bq));
  }

  // optional double bp = 2;
  var $bp = message.bp;
  if ($bp !== undefined) {
    writeVarint32(bb, 17);
    writeDouble(bb, $bp);
  }

  // optional int32 bno = 3;
  var $bno = message.bno;
  if ($bno !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($bno));
  }

  // optional int32 aq = 4;
  var $aq = message.aq;
  if ($aq !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, intToLong($aq));
  }

  // optional double ap = 5;
  var $ap = message.ap;
  if ($ap !== undefined) {
    writeVarint32(bb, 41);
    writeDouble(bb, $ap);
  }

  // optional int32 ano = 6;
  var $ano = message.ano;
  if ($ano !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($ano));
  }
}

exports.decodeQuote = function (binary) {
  return _decodeQuote(wrapByteBuffer(binary));
};

function _decodeQuote(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 bq = 1;
      case 1: {
        message.bq = readVarint32(bb);
        break;
      }

      // optional double bp = 2;
      case 2: {
        message.bp = readDouble(bb);
        break;
      }

      // optional int32 bno = 3;
      case 3: {
        message.bno = readVarint32(bb);
        break;
      }

      // optional int32 aq = 4;
      case 4: {
        message.aq = readVarint32(bb);
        break;
      }

      // optional double ap = 5;
      case 5: {
        message.ap = readDouble(bb);
        break;
      }

      // optional int32 ano = 6;
      case 6: {
        message.ano = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeOptionGreeks = function (message) {
  var bb = popByteBuffer();
  _encodeOptionGreeks(message, bb);
  return toUint8Array(bb);
};

function _encodeOptionGreeks(message, bb) {
  // optional double op = 1;
  var $op = message.op;
  if ($op !== undefined) {
    writeVarint32(bb, 9);
    writeDouble(bb, $op);
  }

  // optional double up = 2;
  var $up = message.up;
  if ($up !== undefined) {
    writeVarint32(bb, 17);
    writeDouble(bb, $up);
  }

  // optional double iv = 3;
  var $iv = message.iv;
  if ($iv !== undefined) {
    writeVarint32(bb, 25);
    writeDouble(bb, $iv);
  }

  // optional double delta = 4;
  var $delta = message.delta;
  if ($delta !== undefined) {
    writeVarint32(bb, 33);
    writeDouble(bb, $delta);
  }

  // optional double theta = 5;
  var $theta = message.theta;
  if ($theta !== undefined) {
    writeVarint32(bb, 41);
    writeDouble(bb, $theta);
  }

  // optional double gamma = 6;
  var $gamma = message.gamma;
  if ($gamma !== undefined) {
    writeVarint32(bb, 49);
    writeDouble(bb, $gamma);
  }

  // optional double vega = 7;
  var $vega = message.vega;
  if ($vega !== undefined) {
    writeVarint32(bb, 57);
    writeDouble(bb, $vega);
  }

  // optional double rho = 8;
  var $rho = message.rho;
  if ($rho !== undefined) {
    writeVarint32(bb, 65);
    writeDouble(bb, $rho);
  }
}

exports.decodeOptionGreeks = function (binary) {
  return _decodeOptionGreeks(wrapByteBuffer(binary));
};

function _decodeOptionGreeks(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional double op = 1;
      case 1: {
        message.op = readDouble(bb);
        break;
      }

      // optional double up = 2;
      case 2: {
        message.up = readDouble(bb);
        break;
      }

      // optional double iv = 3;
      case 3: {
        message.iv = readDouble(bb);
        break;
      }

      // optional double delta = 4;
      case 4: {
        message.delta = readDouble(bb);
        break;
      }

      // optional double theta = 5;
      case 5: {
        message.theta = readDouble(bb);
        break;
      }

      // optional double gamma = 6;
      case 6: {
        message.gamma = readDouble(bb);
        break;
      }

      // optional double vega = 7;
      case 7: {
        message.vega = readDouble(bb);
        break;
      }

      // optional double rho = 8;
      case 8: {
        message.rho = readDouble(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeExtendedFeedDetails = function (message) {
  var bb = popByteBuffer();
  _encodeExtendedFeedDetails(message, bb);
  return toUint8Array(bb);
};

function _encodeExtendedFeedDetails(message, bb) {
  // optional double atp = 1;
  var $atp = message.atp;
  if ($atp !== undefined) {
    writeVarint32(bb, 9);
    writeDouble(bb, $atp);
  }

  // optional double cp = 2;
  var $cp = message.cp;
  if ($cp !== undefined) {
    writeVarint32(bb, 17);
    writeDouble(bb, $cp);
  }

  // optional int64 vtt = 3;
  var $vtt = message.vtt;
  if ($vtt !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $vtt);
  }

  // optional double oi = 4;
  var $oi = message.oi;
  if ($oi !== undefined) {
    writeVarint32(bb, 33);
    writeDouble(bb, $oi);
  }

  // optional double changeOi = 5;
  var $changeOi = message.changeOi;
  if ($changeOi !== undefined) {
    writeVarint32(bb, 41);
    writeDouble(bb, $changeOi);
  }

  // optional double lastClose = 6;
  var $lastClose = message.lastClose;
  if ($lastClose !== undefined) {
    writeVarint32(bb, 49);
    writeDouble(bb, $lastClose);
  }

  // optional double tbq = 7;
  var $tbq = message.tbq;
  if ($tbq !== undefined) {
    writeVarint32(bb, 57);
    writeDouble(bb, $tbq);
  }

  // optional double tsq = 8;
  var $tsq = message.tsq;
  if ($tsq !== undefined) {
    writeVarint32(bb, 65);
    writeDouble(bb, $tsq);
  }

  // optional double close = 9;
  var $close = message.close;
  if ($close !== undefined) {
    writeVarint32(bb, 73);
    writeDouble(bb, $close);
  }

  // optional double lc = 10;
  var $lc = message.lc;
  if ($lc !== undefined) {
    writeVarint32(bb, 81);
    writeDouble(bb, $lc);
  }

  // optional double uc = 11;
  var $uc = message.uc;
  if ($uc !== undefined) {
    writeVarint32(bb, 89);
    writeDouble(bb, $uc);
  }

  // optional double yh = 12;
  var $yh = message.yh;
  if ($yh !== undefined) {
    writeVarint32(bb, 97);
    writeDouble(bb, $yh);
  }

  // optional double yl = 13;
  var $yl = message.yl;
  if ($yl !== undefined) {
    writeVarint32(bb, 105);
    writeDouble(bb, $yl);
  }

  // optional double fp = 14;
  var $fp = message.fp;
  if ($fp !== undefined) {
    writeVarint32(bb, 113);
    writeDouble(bb, $fp);
  }

  // optional int32 fv = 15;
  var $fv = message.fv;
  if ($fv !== undefined) {
    writeVarint32(bb, 120);
    writeVarint64(bb, intToLong($fv));
  }

  // optional int64 mbpBuy = 16;
  var $mbpBuy = message.mbpBuy;
  if ($mbpBuy !== undefined) {
    writeVarint32(bb, 128);
    writeVarint64(bb, $mbpBuy);
  }

  // optional int64 mbpSell = 17;
  var $mbpSell = message.mbpSell;
  if ($mbpSell !== undefined) {
    writeVarint32(bb, 136);
    writeVarint64(bb, $mbpSell);
  }

  // optional int64 tv = 18;
  var $tv = message.tv;
  if ($tv !== undefined) {
    writeVarint32(bb, 144);
    writeVarint64(bb, $tv);
  }

  // optional double dhoi = 19;
  var $dhoi = message.dhoi;
  if ($dhoi !== undefined) {
    writeVarint32(bb, 153);
    writeDouble(bb, $dhoi);
  }

  // optional double dloi = 20;
  var $dloi = message.dloi;
  if ($dloi !== undefined) {
    writeVarint32(bb, 161);
    writeDouble(bb, $dloi);
  }

  // optional double sp = 21;
  var $sp = message.sp;
  if ($sp !== undefined) {
    writeVarint32(bb, 169);
    writeDouble(bb, $sp);
  }

  // optional double poi = 22;
  var $poi = message.poi;
  if ($poi !== undefined) {
    writeVarint32(bb, 177);
    writeDouble(bb, $poi);
  }
}

exports.decodeExtendedFeedDetails = function (binary) {
  return _decodeExtendedFeedDetails(wrapByteBuffer(binary));
};

function _decodeExtendedFeedDetails(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional double atp = 1;
      case 1: {
        message.atp = readDouble(bb);
        break;
      }

      // optional double cp = 2;
      case 2: {
        message.cp = readDouble(bb);
        break;
      }

      // optional int64 vtt = 3;
      case 3: {
        message.vtt = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional double oi = 4;
      case 4: {
        message.oi = readDouble(bb);
        break;
      }

      // optional double changeOi = 5;
      case 5: {
        message.changeOi = readDouble(bb);
        break;
      }

      // optional double lastClose = 6;
      case 6: {
        message.lastClose = readDouble(bb);
        break;
      }

      // optional double tbq = 7;
      case 7: {
        message.tbq = readDouble(bb);
        break;
      }

      // optional double tsq = 8;
      case 8: {
        message.tsq = readDouble(bb);
        break;
      }

      // optional double close = 9;
      case 9: {
        message.close = readDouble(bb);
        break;
      }

      // optional double lc = 10;
      case 10: {
        message.lc = readDouble(bb);
        break;
      }

      // optional double uc = 11;
      case 11: {
        message.uc = readDouble(bb);
        break;
      }

      // optional double yh = 12;
      case 12: {
        message.yh = readDouble(bb);
        break;
      }

      // optional double yl = 13;
      case 13: {
        message.yl = readDouble(bb);
        break;
      }

      // optional double fp = 14;
      case 14: {
        message.fp = readDouble(bb);
        break;
      }

      // optional int32 fv = 15;
      case 15: {
        message.fv = readVarint32(bb);
        break;
      }

      // optional int64 mbpBuy = 16;
      case 16: {
        message.mbpBuy = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 mbpSell = 17;
      case 17: {
        message.mbpSell = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 tv = 18;
      case 18: {
        message.tv = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional double dhoi = 19;
      case 19: {
        message.dhoi = readDouble(bb);
        break;
      }

      // optional double dloi = 20;
      case 20: {
        message.dloi = readDouble(bb);
        break;
      }

      // optional double sp = 21;
      case 21: {
        message.sp = readDouble(bb);
        break;
      }

      // optional double poi = 22;
      case 22: {
        message.poi = readDouble(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeOHLC = function (message) {
  var bb = popByteBuffer();
  _encodeOHLC(message, bb);
  return toUint8Array(bb);
};

function _encodeOHLC(message, bb) {
  // optional string interval = 1;
  var $interval = message.interval;
  if ($interval !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $interval);
  }

  // optional double open = 2;
  var $open = message.open;
  if ($open !== undefined) {
    writeVarint32(bb, 17);
    writeDouble(bb, $open);
  }

  // optional double high = 3;
  var $high = message.high;
  if ($high !== undefined) {
    writeVarint32(bb, 25);
    writeDouble(bb, $high);
  }

  // optional double low = 4;
  var $low = message.low;
  if ($low !== undefined) {
    writeVarint32(bb, 33);
    writeDouble(bb, $low);
  }

  // optional double close = 5;
  var $close = message.close;
  if ($close !== undefined) {
    writeVarint32(bb, 41);
    writeDouble(bb, $close);
  }

  // optional int32 volume = 6;
  var $volume = message.volume;
  if ($volume !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($volume));
  }

  // optional int64 ts = 7;
  var $ts = message.ts;
  if ($ts !== undefined) {
    writeVarint32(bb, 56);
    writeVarint64(bb, $ts);
  }
}

exports.decodeOHLC = function (binary) {
  return _decodeOHLC(wrapByteBuffer(binary));
};

function _decodeOHLC(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string interval = 1;
      case 1: {
        message.interval = readString(bb, readVarint32(bb));
        break;
      }

      // optional double open = 2;
      case 2: {
        message.open = readDouble(bb);
        break;
      }

      // optional double high = 3;
      case 3: {
        message.high = readDouble(bb);
        break;
      }

      // optional double low = 4;
      case 4: {
        message.low = readDouble(bb);
        break;
      }

      // optional double close = 5;
      case 5: {
        message.close = readDouble(bb);
        break;
      }

      // optional int32 volume = 6;
      case 6: {
        message.volume = readVarint32(bb);
        break;
      }

      // optional int64 ts = 7;
      case 7: {
        message.ts = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeMarketFullFeed = function (message) {
  var bb = popByteBuffer();
  _encodeMarketFullFeed(message, bb);
  return toUint8Array(bb);
};

function _encodeMarketFullFeed(message, bb) {
  // optional LTPC ltpc = 1;
  var $ltpc = message.ltpc;
  if ($ltpc !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodeLTPC($ltpc, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional MarketLevel marketLevel = 2;
  var $marketLevel = message.marketLevel;
  if ($marketLevel !== undefined) {
    writeVarint32(bb, 18);
    var nested = popByteBuffer();
    _encodeMarketLevel($marketLevel, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional OptionGreeks optionGreeks = 3;
  var $optionGreeks = message.optionGreeks;
  if ($optionGreeks !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeOptionGreeks($optionGreeks, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional MarketOHLC marketOHLC = 4;
  var $marketOHLC = message.marketOHLC;
  if ($marketOHLC !== undefined) {
    writeVarint32(bb, 34);
    var nested = popByteBuffer();
    _encodeMarketOHLC($marketOHLC, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ExtendedFeedDetails eFeedDetails = 5;
  var $eFeedDetails = message.eFeedDetails;
  if ($eFeedDetails !== undefined) {
    writeVarint32(bb, 42);
    var nested = popByteBuffer();
    _encodeExtendedFeedDetails($eFeedDetails, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

exports.decodeMarketFullFeed = function (binary) {
  return _decodeMarketFullFeed(wrapByteBuffer(binary));
};

function _decodeMarketFullFeed(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional LTPC ltpc = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.ltpc = _decodeLTPC(bb);
        bb.limit = limit;
        break;
      }

      // optional MarketLevel marketLevel = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        message.marketLevel = _decodeMarketLevel(bb);
        bb.limit = limit;
        break;
      }

      // optional OptionGreeks optionGreeks = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.optionGreeks = _decodeOptionGreeks(bb);
        bb.limit = limit;
        break;
      }

      // optional MarketOHLC marketOHLC = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        message.marketOHLC = _decodeMarketOHLC(bb);
        bb.limit = limit;
        break;
      }

      // optional ExtendedFeedDetails eFeedDetails = 5;
      case 5: {
        var limit = pushTemporaryLength(bb);
        message.eFeedDetails = _decodeExtendedFeedDetails(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeIndexFullFeed = function (message) {
  var bb = popByteBuffer();
  _encodeIndexFullFeed(message, bb);
  return toUint8Array(bb);
};

function _encodeIndexFullFeed(message, bb) {
  // optional LTPC ltpc = 1;
  var $ltpc = message.ltpc;
  if ($ltpc !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodeLTPC($ltpc, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional MarketOHLC marketOHLC = 2;
  var $marketOHLC = message.marketOHLC;
  if ($marketOHLC !== undefined) {
    writeVarint32(bb, 18);
    var nested = popByteBuffer();
    _encodeMarketOHLC($marketOHLC, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional double lastClose = 3;
  var $lastClose = message.lastClose;
  if ($lastClose !== undefined) {
    writeVarint32(bb, 25);
    writeDouble(bb, $lastClose);
  }

  // optional double yh = 4;
  var $yh = message.yh;
  if ($yh !== undefined) {
    writeVarint32(bb, 33);
    writeDouble(bb, $yh);
  }

  // optional double yl = 5;
  var $yl = message.yl;
  if ($yl !== undefined) {
    writeVarint32(bb, 41);
    writeDouble(bb, $yl);
  }
}

exports.decodeIndexFullFeed = function (binary) {
  return _decodeIndexFullFeed(wrapByteBuffer(binary));
};

function _decodeIndexFullFeed(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional LTPC ltpc = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.ltpc = _decodeLTPC(bb);
        bb.limit = limit;
        break;
      }

      // optional MarketOHLC marketOHLC = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        message.marketOHLC = _decodeMarketOHLC(bb);
        bb.limit = limit;
        break;
      }

      // optional double lastClose = 3;
      case 3: {
        message.lastClose = readDouble(bb);
        break;
      }

      // optional double yh = 4;
      case 4: {
        message.yh = readDouble(bb);
        break;
      }

      // optional double yl = 5;
      case 5: {
        message.yl = readDouble(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeFullFeed = function (message) {
  var bb = popByteBuffer();
  _encodeFullFeed(message, bb);
  return toUint8Array(bb);
};

function _encodeFullFeed(message, bb) {
  // optional MarketFullFeed marketFF = 1;
  var $marketFF = message.marketFF;
  if ($marketFF !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodeMarketFullFeed($marketFF, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional IndexFullFeed indexFF = 2;
  var $indexFF = message.indexFF;
  if ($indexFF !== undefined) {
    writeVarint32(bb, 18);
    var nested = popByteBuffer();
    _encodeIndexFullFeed($indexFF, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

exports.decodeFullFeed = function (binary) {
  return _decodeFullFeed(wrapByteBuffer(binary));
};

function _decodeFullFeed(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional MarketFullFeed marketFF = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.marketFF = _decodeMarketFullFeed(bb);
        bb.limit = limit;
        break;
      }

      // optional IndexFullFeed indexFF = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        message.indexFF = _decodeIndexFullFeed(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeOptionChain = function (message) {
  var bb = popByteBuffer();
  _encodeOptionChain(message, bb);
  return toUint8Array(bb);
};

function _encodeOptionChain(message, bb) {
  // optional LTPC ltpc = 1;
  var $ltpc = message.ltpc;
  if ($ltpc !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodeLTPC($ltpc, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional Quote bidAskQuote = 2;
  var $bidAskQuote = message.bidAskQuote;
  if ($bidAskQuote !== undefined) {
    writeVarint32(bb, 18);
    var nested = popByteBuffer();
    _encodeQuote($bidAskQuote, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional OptionGreeks optionGreeks = 3;
  var $optionGreeks = message.optionGreeks;
  if ($optionGreeks !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeOptionGreeks($optionGreeks, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ExtendedFeedDetails eFeedDetails = 4;
  var $eFeedDetails = message.eFeedDetails;
  if ($eFeedDetails !== undefined) {
    writeVarint32(bb, 34);
    var nested = popByteBuffer();
    _encodeExtendedFeedDetails($eFeedDetails, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

exports.decodeOptionChain = function (binary) {
  return _decodeOptionChain(wrapByteBuffer(binary));
};

function _decodeOptionChain(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional LTPC ltpc = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.ltpc = _decodeLTPC(bb);
        bb.limit = limit;
        break;
      }

      // optional Quote bidAskQuote = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        message.bidAskQuote = _decodeQuote(bb);
        bb.limit = limit;
        break;
      }

      // optional OptionGreeks optionGreeks = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.optionGreeks = _decodeOptionGreeks(bb);
        bb.limit = limit;
        break;
      }

      // optional ExtendedFeedDetails eFeedDetails = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        message.eFeedDetails = _decodeExtendedFeedDetails(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeFeed = function (message) {
  var bb = popByteBuffer();
  _encodeFeed(message, bb);
  return toUint8Array(bb);
};

function _encodeFeed(message, bb) {
  // optional LTPC ltpc = 1;
  var $ltpc = message.ltpc;
  if ($ltpc !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodeLTPC($ltpc, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional FullFeed ff = 2;
  var $ff = message.ff;
  if ($ff !== undefined) {
    writeVarint32(bb, 18);
    var nested = popByteBuffer();
    _encodeFullFeed($ff, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional OptionChain oc = 3;
  var $oc = message.oc;
  if ($oc !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeOptionChain($oc, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

exports.decodeFeed = function (binary) {
  return _decodeFeed(wrapByteBuffer(binary));
};

function _decodeFeed(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional LTPC ltpc = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.ltpc = _decodeLTPC(bb);
        bb.limit = limit;
        break;
      }

      // optional FullFeed ff = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        message.ff = _decodeFullFeed(bb);
        bb.limit = limit;
        break;
      }

      // optional OptionChain oc = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.oc = _decodeOptionChain(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

exports.encodeFeedResponse = function (message) {
  var bb = popByteBuffer();
  _encodeFeedResponse(message, bb);
  return toUint8Array(bb);
};

function _encodeFeedResponse(message, bb) {
  // optional Type type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeType[$type]);
  }

  // optional map<string, Feed> feeds = 2;
  var map$feeds = message.feeds;
  if (map$feeds !== undefined) {
    for (var key in map$feeds) {
      var nested = popByteBuffer();
      var value = map$feeds[key];
      writeVarint32(nested, 10);
      writeString(nested, key);
      writeVarint32(nested, 18);
      var nestedValue = popByteBuffer();
      _encodeFeed(value, nestedValue);
      writeVarint32(nested, nestedValue.limit);
      writeByteBuffer(nested, nestedValue);
      pushByteBuffer(nestedValue);
      writeVarint32(bb, 18);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

exports.decodeFeedResponse = function (binary) {
  return _decodeFeedResponse(wrapByteBuffer(binary));
};

function _decodeFeedResponse(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional Type type = 1;
      case 1: {
        message.type = exports.decodeType[readVarint32(bb)];
        break;
      }

      // optional map<string, Feed> feeds = 2;
      case 2: {
        var values = message.feeds || (message.feeds = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readString(bb, readVarint32(bb));
              break;
            }
            case 2: {
              var valueLimit = pushTemporaryLength(bb);
              value = _decodeFeed(bb);
              bb.limit = valueLimit;
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error('Invalid data for map: feeds');
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

function pushTemporaryLength(bb) {
  var length = readVarint32(bb);
  var limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb, type) {
  switch (type) {
    case 0:
      while (readByte(bb) & 0x80) {}
      break;
    case 2:
      skip(bb, readVarint32(bb));
      break;
    case 5:
      skip(bb, 4);
      break;
    case 1:
      skip(bb, 8);
      break;
    default:
      throw new Error('Unimplemented type: ' + type);
  }
}

function stringToLong(value) {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value) {
  var low = value.low;
  var high = value.high;
  return String.fromCharCode(
    low & 0xffff,
    low >>> 16,
    high & 0xffff,
    high >>> 16,
  );
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

var f32 = new Float32Array(1);
var f32_u8 = new Uint8Array(f32.buffer);

var f64 = new Float64Array(1);
var f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value) {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

var bbStack = [];

function popByteBuffer() {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb) {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes) {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb) {
  var bytes = bb.bytes;
  var limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb, offset) {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb) {
  return bb.offset >= bb.limit;
}

function grow(bb, count) {
  var bytes = bb.bytes;
  var offset = bb.offset;
  var limit = bb.limit;
  var finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    var newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb, count) {
  var offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb, count) {
  var offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb, buffer) {
  var offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb, count) {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  var offset = advance(bb, count);
  var fromCharCode = String.fromCharCode;
  var bytes = bb.bytes;
  var invalid = '\uFFFD';
  var text = '';

  for (var i = 0; i < count; i++) {
    var c1 = bytes[i + offset],
      c2,
      c3,
      c4,
      c;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xe0) === 0xc0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xc0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1f) << 6) | (c2 & 0x3f);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xf0) == 0xe0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xc0c0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0f) << 12) | ((c2 & 0x3f) << 6) | (c3 & 0x3f);
          if (c < 0x0800 || (c >= 0xd800 && c <= 0xdfff)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xf8) == 0xf0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xc0c0c0) !== 0x808080)
          text += invalid;
        else {
          c =
            ((c1 & 0x07) << 0x12) |
            ((c2 & 0x3f) << 0x0c) |
            ((c3 & 0x3f) << 0x06) |
            (c4 & 0x3f);
          if (c < 0x10000 || c > 0x10ffff) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xd800, (c & 0x3ff) + 0xdc00);
            i += 3;
          }
        }
      }
    } else text += invalid;
  }

  return text;
}

function writeString(bb, text) {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  var n = text.length;
  var byteCount = 0;

  // Write the byte count first
  for (var i = 0; i < n; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35fdc00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  var offset = grow(bb, byteCount);
  var bytes = bb.bytes;

  // Then write the bytes
  for (var i = 0; i < n; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35fdc00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1f) | 0xc0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0f) | 0xe0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xf0;
          bytes[offset++] = ((c >> 12) & 0x3f) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3f) | 0x80;
      }
      bytes[offset++] = (c & 0x3f) | 0x80;
    }
  }
}

function writeByteBuffer(bb, buffer) {
  var offset = grow(bb, buffer.limit);
  var from = bb.bytes;
  var to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (var i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb) {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb, value) {
  var offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb) {
  var offset = advance(bb, 4);
  var bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb, value) {
  var offset = grow(bb, 4);
  var bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb) {
  var offset = advance(bb, 8);
  var bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb, value) {
  var offset = grow(bb, 8);
  var bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb) {
  var offset = advance(bb, 4);
  var bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb, value) {
  var offset = grow(bb, 4);
  var bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb, unsigned) {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb, value) {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb) {
  var c = 0;
  var value = 0;
  var b;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7f) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb, value) {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb, unsigned) {
  var part0 = 0;
  var part1 = 0;
  var part2 = 0;
  var b;

  b = readByte(bb);
  part0 = b & 0x7f;
  if (b & 0x80) {
    b = readByte(bb);
    part0 |= (b & 0x7f) << 7;
    if (b & 0x80) {
      b = readByte(bb);
      part0 |= (b & 0x7f) << 14;
      if (b & 0x80) {
        b = readByte(bb);
        part0 |= (b & 0x7f) << 21;
        if (b & 0x80) {
          b = readByte(bb);
          part1 = b & 0x7f;
          if (b & 0x80) {
            b = readByte(bb);
            part1 |= (b & 0x7f) << 7;
            if (b & 0x80) {
              b = readByte(bb);
              part1 |= (b & 0x7f) << 14;
              if (b & 0x80) {
                b = readByte(bb);
                part1 |= (b & 0x7f) << 21;
                if (b & 0x80) {
                  b = readByte(bb);
                  part2 = b & 0x7f;
                  if (b & 0x80) {
                    b = readByte(bb);
                    part2 |= (b & 0x7f) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb, value) {
  var part0 = value.low >>> 0;
  var part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  var part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  var size =
    part2 === 0
      ? part1 === 0
        ? part0 < 1 << 14
          ? part0 < 1 << 7
            ? 1
            : 2
          : part0 < 1 << 21
            ? 3
            : 4
        : part1 < 1 << 14
          ? part1 < 1 << 7
            ? 5
            : 6
          : part1 < 1 << 21
            ? 7
            : 8
      : part2 < 1 << 7
        ? 9
        : 10;

  var offset = grow(bb, size);
  var bytes = bb.bytes;

  switch (size) {
    case 10:
      bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9:
      bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7f;
    case 8:
      bytes[offset + 7] =
        size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7f;
    case 7:
      bytes[offset + 6] =
        size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7f;
    case 6:
      bytes[offset + 5] =
        size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7f;
    case 5:
      bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7f;
    case 4:
      bytes[offset + 3] =
        size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7f;
    case 3:
      bytes[offset + 2] =
        size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7f;
    case 2:
      bytes[offset + 1] =
        size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7f;
    case 1:
      bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7f;
  }
}

function readVarint32ZigZag(bb) {
  var value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb, value) {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb) {
  var value = readVarint64(bb, /* unsigned */ false);
  var low = value.low;
  var high = value.high;
  var flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb, value) {
  var low = value.low;
  var high = value.high;
  var flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
