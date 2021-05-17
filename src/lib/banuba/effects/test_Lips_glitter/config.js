
function Effect()
{
    var self = this;

    this.init = function() {
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "quad.bsm2");
        // R G B A -- lips replacement color
        Api.meshfxMsg("shaderVec4", 0, 1, "0.7 0.1 0.1 1");
        // [0] sCoef -- color saturation
        // [1] vCoef -- shine brightness (intensity)
        // [2] sCoef1 -- shine saturation (color bleeding)
        // [3] bCoef -- darkness (more is less)
        Api.meshfxMsg("shaderVec4", 0, 2, "0.9 0.9 0.6 1");

        // glitter params:
        // [0] noiseness/width
        // [1] amount of glitter highlights over whole lips area
        // [2] grain/pixely
        Api.meshfxMsg("shaderVec4", 0, 3, "1.0 1.0 0.4");
        Api.showRecordButton();
        // self.faceActions = [];
    };

    this.faceActions = [function(){ Api.meshfxMsg("shaderVec4", 0, 0, "1.") ;}];
    this.noFaceActions = [function(){ Api.meshfxMsg("shaderVec4", 0, 0, "0."); }];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

function setColor(color)
{
    var c = JSON.parse(color);
    Api.meshfxMsg("shaderVec4", 0, 1, c[0] + " " + c[1] + " " + c[2] + " " + c[3]);
}

function setParams(params)
{
    var c = JSON.parse(params);
    Api.meshfxMsg("shaderVec4", 0, 2, c[0] + " " + c[1] + " " + c[2] + " " + c[3]);
    if( c[4] )
    	Api.meshfxMsg("shaderVec4", 0, 3, c[4] + " " + c[5] + " " + c[6]);
}

configure(new Effect());
