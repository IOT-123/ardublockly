goog.provide('Blockly.Arduino.d1mini');

goog.require('Blockly.Arduino');


// function hexToR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }

// function hexToG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }

// function hexToB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }

// function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }

Blockly.Arduino.d1mini_rgb_led = function() {
    var dropdown_pin = this.getFieldValue('PIN');
    var NextPIN = _get_next_pin(dropdown_pin);

    Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    Blockly.Arduino.setups_['setup_input_' + NextPIN] = 'pinMode(' + NextPIN + ', OUTPUT);';
    Blockly.Arduino.definitions_['define_uint8'] = "#define uint8 unsigned char";
    Blockly.Arduino.definitions_['define_uint16'] = "#define uint16 unsigned int";
    Blockly.Arduino.definitions_['define_uint32'] = "#define uint32 unsigned long int";
    Blockly.Arduino.definitions_['define_clkproduce_' + dropdown_pin] = "void ClkProduce_" + dropdown_pin + "(void)\n" +
        "{\n" +
        "  digitalWrite(" + dropdown_pin + ", LOW);\n" +
        "  delayMicroseconds(20);\n" +
        "  digitalWrite(" + dropdown_pin + ", HIGH);\n" +
        "  delayMicroseconds(20);\n" +
        "}\n";
    Blockly.Arduino.definitions_['define_send32zero_' + dropdown_pin] = "void Send32Zero_" + dropdown_pin + "(void)\n" +
        "{\n" +
        "  uint8 i;\n" +
        "  for (i=0; i<32; i++)\n" +
        "  {\n" +
        "    digitalWrite(" + NextPIN + ", LOW);\n" +
        "    ClkProduce_" + dropdown_pin + "();\n" +
        "  }\n" +
        "}\n";
    Blockly.Arduino.definitions_['define_taskanticode'] = "uint8 TakeAntiCode(uint8 dat)\n" +
        "{\n" +
        "  uint8 tmp = 0;\n" +
        "  if ((dat & 0x80) == 0)\n" +
        "  {\n" +
        "    tmp |= 0x02;\n" +
        "  }\n" +
        "  \n" +
        "  if ((dat & 0x40) == 0)\n" +
        "  {\n" +
        "    tmp |= 0x01;\n" +
        "  }\n" +
        "  return tmp;\n" +
        "}\n";
    Blockly.Arduino.definitions_['define_datasend_' + dropdown_pin] = "// gray data\n" +
        "void DatSend_" + dropdown_pin + "(uint32 dx)\n" +
        "{\n" +
        "  uint8 i;\n" +
        "  for (i=0; i<32; i++)\n" +
        "  {\n" +
        "    if ((dx & 0x80000000) != 0)\n" +
        "    {\n" +
        "      digitalWrite(" + NextPIN + ", HIGH);\n" +
        "    }\n" +
        "    else\n" +
        "    {\n" +
        "      digitalWrite(" + NextPIN + ", LOW);\n" +
        "    }\n" +
        "  dx <<= 1;\n" +
        "  ClkProduce_" + dropdown_pin + "();\n" +
        "  }\n" +
        "}\n";
    Blockly.Arduino.definitions_['define_datadealwithsend_' + dropdown_pin] = "// data processing\n" +
        "void DataDealWithAndSend_" + dropdown_pin + "(uint8 r, uint8 g, uint8 b)\n" +
        "{\n" +
        "  uint32 dx = 0;\n" +
        "  dx |= (uint32)0x03 << 30;             // highest two bits 1，flag bits\n" +
        "  dx |= (uint32)TakeAntiCode(b) << 28;\n" +
        "  dx |= (uint32)TakeAntiCode(g) << 26;\n" +
        "  dx |= (uint32)TakeAntiCode(r) << 24;\n" +
        "\n" +
        "  dx |= (uint32)b << 16;\n" +
        "  dx |= (uint32)g << 8;\n" +
        "  dx |= r;\n" +
        "\n" +
        "  DatSend_" + dropdown_pin + "(dx);\n" +
        "}\n";
    var code = "Send32Zero_" + dropdown_pin + "(); // begin\n";
    //console.log(this.itemCount_);
    if (this.itemCount_ == 0) {
        return '';
    } else {
        for (var n = 0; n < this.itemCount_; n++) {
            var colour_rgb = this.getFieldValue('RGB' + n);
            //console.log(colour_rgb);
            code += "DataDealWithAndSend_" + dropdown_pin + "(" + hexToR(colour_rgb) + ", " + hexToG(colour_rgb) + ", " + hexToB(colour_rgb) + "); // first node data\n";
        }
    }
    code += "Send32Zero_" + dropdown_pin + "();  // send to update data\n";
    return code;
};

Blockly.Arduino.d1mini_button = function() {
    var dropdown_pin = 'D3'; //this.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_button_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Arduino.d1mini_button_comment = function() {
    Blockly.Arduino.definitions_['d1mini_button_comment_include'] = '//1-Button Sheild\n//  PIN: D3\n//  Maker: Wemos\n';
    return null;
};

Blockly.Arduino.d1mini_relay_v2 = function() {
    var dropdown_pin = 'D1';
    var dropdown_state = this.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_relay_v2_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_state + ');\n'
    return code;
}


Blockly.Arduino.d1mini_relay_v2_comment = function() {
    Blockly.Arduino.definitions_['d1mini_relay_v2_comment_include'] = '//Relay Sheild V2\n//  PIN: D1\n//  Maker: Wemos\n';
    return null;
};


Blockly.Arduino.d1mini_matrix_led_comment = function() {
    var comment = '//LED Matrix\n//  PINS: D5, D7\n';
    comment += '//  Maker: Wemos\n';
    comment += '// Library: https://github.com/wemos/WEMOS_Matrix_LED_Shield_Arduino_Library/tree/master/src';
    comment += '// Note: the individual "LED MATRIX" blocks may not be compatible together in the one layout';
    Blockly.Arduino.definitions_['d1mini_matrix_led_comment_include'] = comment;
    return null;
};

Blockly.Arduino.d1mini_matrix_led_single_state = function() {
    var intensity = this.getFieldValue('INTENS');
    var state = this.getFieldValue('STAT');
    var x = this.getFieldValue('X');
    var y = this.getFieldValue('Y');
    Blockly.Arduino.definitions_['d1mini_matrix_led'] = '//Library: https://github.com/wemos/WEMOS_Matrix_LED_Shield_Arduino_Library/tree/master/src\n#include <WEMOS_Matrix_LED.h>\n\nMLED mled(' + intensity + '); //set intensity=' + intensity + '\n';
    var code = state == 'HIGH' ? 'mled.dot(' + x + ',' + y + '); // draw dot\n' : 'mled.dot(' + x + ',' + y + ',0);//clear dot\n'
    code += 'mled.display();';
    return code;
}

Blockly.Arduino.d1mini_matrix_led_loop_single_state = function() {
    var intensity = this.getFieldValue('INTENS');
    var state = Blockly.Arduino.valueToCode(this, 'STAT', Blockly.Arduino.ORDER_ATOMIC);
    var x = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC);
    var y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.definitions_['d1mini_matrix_led'] = '//Library: https://github.com/wemos/WEMOS_Matrix_LED_Shield_Arduino_Library/tree/master/src\n#include <WEMOS_Matrix_LED.h>\n\nMLED mled(' + intensity + '); //set intensity=' + intensity + '\n';
    var code = 'mled.dot(' + x + ',' + y + ',' + state + ');\n'
    code += 'mled.display();';
    return code;
}

Blockly.Arduino.d1mini_matrix_led_loop_all_intensity = function() {
    var intensity = Blockly.Arduino.valueToCode(this, 'INTENS', Blockly.Arduino.ORDER_ATOMIC);
    var definitions = '//Library: https://github.com/wemos/WEMOS_Matrix_LED_Shield_Arduino_Library/tree/master/src\n';
    definitions += '#include <WEMOS_Matrix_LED.h>\n';
    definitions += 'MLED mled(0); //set intensity=0\n';
    Blockly.Arduino.definitions_['d1mini_matrix_led'] = definitions;
    Blockly.Arduino.setups_['d1mini_matrix_led'] = 'for(int i=0; i<8; i++){\n    mled.disBuffer[i]=0xff;  //full screen\n  }';
    var code = 'mled.intensity=' + intensity + ';//change intensity\n'
    code += 'mled.display();\n';
    return code;
};

Blockly.Arduino.d1mini_micro_sd_card_comment = function() {
    var comment = '//Micro SD Card (MSDC)\n//  PINS: D5, D6, D7, D8, 3V3, G\n';
    comment += '//  SPI PINS: D5 = CLK, D6 = MISO, D7 = MOSI, D8 = CS\n';
    comment += '//  Maker: Wemos\n';
    comment += '//  File Format: The SD card library uses 8.3 format filenames and is case-insensitive. eg. IMAGE.JPG is the same as image.jpg\n';
    Blockly.Arduino.definitions_['d1mini_micro_sd_card_comment_include'] = comment;
    return null;
};

Blockly.Arduino.d1mini_micro_sd_card_write = function() {
    var file = Blockly.Arduino.valueToCode(this, 'FILE', Blockly.Arduino.ORDER_ATOMIC);
    var text = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ATOMIC);
    var definitions = '#include <SPI.h>\n#include <SD.h>\n\n';
    if (!file || file.length == 0) {
        definitions += '//MSDC IMPORTANT Text or Variable block needs to be added to "Micro SD Card Write" block (File:)\n'
    }
    if (!text || text.length == 0) {
        definitions += '//MSDC IMPORTANT Text or Variable block needs to be added to "Micro SD Card Write" block (Text:)\n'
    }
    Blockly.Arduino.definitions_['d1mini_micro_sd_card'] = definitions;
    var setups_open = '//MSDC Initialize\n  if (!SD.begin(D8)) {\n    //MSDC initialization failed!\n    return;\n  }\n  //MSDC initialization done.\n';
    setups_open += '  //MSDC open the file. note that only one file can be open at a time\n  File myFile = SD.open(' + file + ', FILE_WRITE);\n'
    Blockly.Arduino.setups_['d1mini_micro_sd_card_open'] = setups_open;
    var code = '  //MSDC if the file opened okay, write to it:\n  if (myFile) {\n    myFile.println(' + text + ');\n    myFile.close();\n  } else {\n    //MSDC error opening test.txt\n  }\n';
    return code;
};


Blockly.Arduino.d1mini_micro_sd_card_read = function() {
    var file = Blockly.Arduino.valueToCode(this, 'FILE', Blockly.Arduino.ORDER_ATOMIC);
    var definitions = '#include <SPI.h>\n#include <SD.h>\n\n';
    if (!file || file.length == 0) {
        definitions += '//MSDC IMPORTANT Text or Variable block needs to be added to "Micro SD Card Write" block (File:)\n'
    }
    Blockly.Arduino.definitions_['d1mini_micro_sd_card'] = definitions;
    var setups_open = '//MSDC Initialize\n  if (!SD.begin(D8)) {\n    //MSDC initialization failed!\n    return;\n  }\n  //MSDC initialization done.\n';
    setups_open += '  //MSDC open the file. note that only one file can be open at a time\n  File myFile = SD.open(' + file + ', FILE_WRITE);\n'
    Blockly.Arduino.setups_['d1mini_micro_sd_card_open'] = setups_open;
    var code = 'myFile.read();\n //NEEDS AVAILABLE LOOP';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};