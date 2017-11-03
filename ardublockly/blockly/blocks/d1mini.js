goog.provide('Blockly.Blocks.d1mini');

goog.require('Blockly.Blocks');


Blockly.Blocks['d1mini_rgb_led'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=Twig_-_Chainable_RGB_LED',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("RGB LED")
            .appendField(new Blockly.FieldImage("images/d1mini_led_rgb.png", 64, 64))
            .appendField("PIN#")
            .appendField(new Blockly.FieldDropdown(profile.default.digital), "PIN")
        this.appendDummyInput("COLOR0")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Color 1")
            .appendField(new Blockly.FieldColour("#00ff00"), "RGB0");
        this.setMutator(new Blockly.Mutator(['d1mini_rgb_led_item']));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('256 color LED, currently Chainable feature is not support');
        this.itemCount_ = 1;
    },
    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        for (var x = 0; x < this.itemCount_; x++) {
            var colour_rgb = this.getFieldValue('RGB0');
            //alert(colour_rgb);
            container.setAttribute('RGB' + x, colour_rgb);
        }
        return container;
    },
    domToMutation: function(xmlElement) {
        for (var x = 0; x < this.itemCount_; x++) {
            this.removeInput('COLOR' + x);
        }
        this.itemCount_ = window.parseInt(xmlElement.getAttribute('items'), 10);
        for (var x = 0; x < this.itemCount_; x++) {
            var color = window.parseInt(xmlElement.getAttribute('RGB' + x), "#00ff00");
            var input = this.appendDummyInput('COLOR' + x);
            //if (x == 0) {
            input.setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Color " + (x + 1))
                .appendField(new Blockly.FieldColour(color), "RGB" + x);
            //}
        }
        if (this.itemCount_ == 0) {
            this.appendDummyInput('COLOR0')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField("Color 1")
                .appendField(new Blockly.FieldColour("#00ff00"), "RGB0");
        }
    },
    decompose: function(workspace) {
        var containerBlock = Blockly.Block.obtain(workspace,
            'd1mini_rgb_led_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.itemCount_; x++) {
            var itemBlock = Blockly.Block.obtain(workspace, 'd1mini_rgb_led_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function(containerBlock) {
            // Disconnect all input blocks and remove all inputs.
            if (this.itemCount_ == 0) {
                this.removeInput('COLOR0');
            } else {
                for (var x = this.itemCount_ - 1; x >= 0; x--) {
                    //console.log("cnt:"+x);
                    this.removeInput('COLOR' + x);
                }
            }
            /*var top;
            if(this.itemCount_ > 0){
              top = this.itemCount_-1;
            } else {
              top = 0;
            }
            console.log("top:"+top);*/
            this.itemCount_ = 0;
            // Rebuild the block's inputs.
            var itemBlock = containerBlock.getInputTargetBlock('STACK');
            while (itemBlock) {
                var colour_rgb = this.getFieldValue('RGB' + this.itemCount_);
                if (colour_rgb == null) {
                    colour_rgb = "00ff00";
                }
                //console.log("blk:"+this.itemCount_);
                /*if(top>this.itemCount_){
                  this.removeInput('COLOR' + this.itemCount_);
                }*/
                var input = this.appendDummyInput('COLOR' + this.itemCount_);
                //if (this.itemCount_ == 0) {
                input.setAlign(Blockly.ALIGN_RIGHT)
                    .appendField("Color " + (this.itemCount_ + 1))
                    .appendField(new Blockly.FieldColour(colour_rgb), "RGB" + this.itemCount_);
                //}
                // Reconnect any child blocks.
                if (itemBlock.valueConnection_) {
                    input.connection.connect(itemBlock.valueConnection_);
                }
                this.itemCount_++;
                itemBlock = itemBlock.nextConnection &&
                    itemBlock.nextConnection.targetBlock();
            }
            if (this.itemCount_ == 0) {
                this.appendDummyInput('COLOR0')
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField("Color 1")
                    .appendField(new Blockly.FieldColour("#00ff00"), "RGB0");
            }
        }
        /*saveConnections: function(containerBlock) {
          // Store a pointer to any connected child blocks.
          var itemBlock = containerBlock.getInputTargetBlock('STACK');
          var x = 0;
          while (itemBlock) {
            var input = this.getInput('COLOR' + x);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            x++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
          }
        }*/
};

Blockly.Blocks['d1mini_rgb_led_container'] = {
    // Container.
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Container");
        this.appendStatementInput('STACK');
        this.setTooltip("Add, remove items to reconfigure this chain");
        this.contextMenu = false;
    }
};

Blockly.Blocks['d1mini_rgb_led_item'] = {
    // Add items.
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Item");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Add an item to the chain");
        this.contextMenu = false;
    }
};

Blockly.Blocks['d1mini_button'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("1-Button")
            .appendField(new Blockly.FieldImage("images/d1mini_one_button.png", 64, 64))
            .appendField("PIN:")
            .appendField(new Blockly.FieldLabel('D3'));
        this.setOutput(true, 'Boolean');
        this.setTooltip('Basic digital input');
    }
};

Blockly.Blocks['d1mini_button_comment'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("//1-Button")
            .appendField(new Blockly.FieldImage("images/d1mini_one_button.png", 200, 200))
        this.setTooltip('Button Comment');
    }
};

Blockly.Blocks['d1mini_relay_v2'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Relay V2")
            .appendField(new Blockly.FieldImage("images/d1mini_relay_v2.png", 64, 64))
            .appendField("PIN:")
            .appendField(new Blockly.FieldLabel('D1'))
            .appendField("State:")
            .appendField(new Blockly.FieldDropdown([
                ["HIGH", "HIGH"],
                ["LOW", "LOW"]
            ]), "STAT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('capable of switching a much higher voltages and currents. The maximum voltage and current that can be controlled by this module upto 250V at 10 amps.');
    }
};



Blockly.Blocks['d1mini_relay_v2_comment'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("//Relay V2")
            .appendField(new Blockly.FieldImage("images/d1mini_relay_v2.png", 200, 200))
        this.setTooltip('Button Comment');
    }
};


Blockly.Blocks['d1mini_matrix_led_comment'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("//Matrix LED")
            .appendField(new Blockly.FieldImage("images/d1mini_matrix_led.png", 200, 200))
        this.setTooltip('Button Comment');
    }
};

var matrixArray = [
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"]
];

Blockly.Blocks['d1mini_matrix_led_single_state'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Matrix LED")
            .appendField(new Blockly.FieldImage("images/d1mini_matrix_led.png", 64, 64))
            .appendField("PIN:")
            .appendField(new Blockly.FieldLabel('D5, D7'));
        this.appendDummyInput()
            .appendField("SINGLE LED STATE");
        var dropdown = new Blockly.FieldDropdown(matrixArray);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Intensity:")
            .appendField(dropdown, "INTENS");
        dropdown.setValue('5');
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("State:")
            .appendField(new Blockly.FieldDropdown([
                ["HIGH", "HIGH"],
                ["LOW", "LOW"]
            ]), "STAT");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("X:")
            .appendField(new Blockly.FieldDropdown(matrixArray), "X");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Y:")
            .appendField(new Blockly.FieldDropdown(matrixArray), "Y");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('capable of switching a much higher voltages and currents. The maximum voltage and current that can be controlled by this module upto 250V at 10 amps.');
    }
};

Blockly.Blocks['d1mini_matrix_led_loop_single_state'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Matrix LED")
            .appendField(new Blockly.FieldImage("images/d1mini_matrix_led.png", 64, 64))
            .appendField("PIN:")
            .appendField(new Blockly.FieldLabel('D5, D7'));
        this.appendDummyInput()
            .appendField("LOOP SINGLE LED STATE");
        var dropdown = new Blockly.FieldDropdown(matrixArray);
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Intensity:")
            .appendField(dropdown, "INTENS");
        dropdown.setValue('5');
        this.appendValueInput("STAT", 'Boolean')
            .setCheck('Boolean')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("State:");
        this.appendValueInput("X", 'Number')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("X:");
        this.appendValueInput("Y", 'Number')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Y:");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('capable of switching a much higher voltages and currents. The maximum voltage and current that can be controlled by this module upto 250V at 10 amps.');
    }
};

Blockly.Blocks['d1mini_matrix_led_loop_all_intensity'] = {
    helpUrl: 'http://www.seeedstudio.com/wiki/index.php?title=GROVE_-_Starter_Bundle_V1.0b#Button',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Matrix LED")
            .appendField(new Blockly.FieldImage("images/d1mini_matrix_led.png", 64, 64))
            .appendField("PIN:")
            .appendField(new Blockly.FieldLabel('D5, D7'));
        this.appendDummyInput()
            .appendField("LOOP ALL LED INTENSITY");
        this.appendValueInput("INTENS", 'Number')
            .setCheck('Number')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Intensity:");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('');
    }
};

Blockly.Blocks['d1mini_micro_sd_card_comment'] = {
    helpUrl: '',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("//Micro SD Card")
            .appendField(new Blockly.FieldImage("images/d1mini_sd_card.png", 200, 200))
        this.setTooltip('SD Card Comment');
    }
};

Blockly.Blocks['d1mini_micro_sd_card_write'] = {
    helpUrl: '',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Micro SD Card")
            .appendField(new Blockly.FieldImage("images/d1mini_sd_card.png", 64, 64))
            .appendField("PIN:")
            .appendField(new Blockly.FieldLabel('D5, D6, D7, D8'));
        this.appendDummyInput()
            .appendField("WRITE TEXT TO FILE");
        this.appendValueInput("FILE", 'String')
            .setCheck('String')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("File:");
        this.appendValueInput("TEXT", 'String')
            .setCheck('String')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Text:");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('');
    }
};

Blockly.Blocks['d1mini_micro_sd_card_read'] = {
    helpUrl: '',
    init: function() {
        this.setColour(190);
        this.appendDummyInput()
            .appendField("Micro SD Card")
            .appendField(new Blockly.FieldImage("images/d1mini_sd_card.png", 64, 64))
            .appendField("PIN:")
            .appendField(new Blockly.FieldLabel('D5, D6, D7, D8'));
        this.appendDummyInput()
            .appendField("READ TEXT FROM FILE");
        this.appendValueInput("FILE", 'String')
            .setCheck('String')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("File:");
        this.setOutput(true, 'String');
        this.setTooltip('Basic digital input');
    }
};