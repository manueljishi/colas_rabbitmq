const exec = require('child_process');

function createEmptyTar(path,name){
    exec(`tar -cf ${path}${name} --files-from /dev/null`, (err)=>{
        if(err){
            return err;
        }else{
            return null;
        }
    })
}

function appendToTar(tarPath, filePath){
    exec(`tar -rvf ${tarPath} ${filePath}`, (err)=>{
        if(err){
            return err;
        }else{
            return null;
        }
    })
}

exports.createEmptyTar = createEmptyTar,
exports.appendToTar = appendToTar;