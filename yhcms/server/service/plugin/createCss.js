import { Meteor } from 'meteor/meteor';
import { Projects } from '../../../universal/collections';
import { upload2qiniu } from '../../utils/upload2qiniu';
import svg2css from 'svg2css';
import path from 'path';
import secret from '../../../secret.json';
import config from '../../../config.json';

const projPath = path.join(config.uplaodPath, 'uploads');

function createCss(proj) {
    return new Promise(function(resolve, reject) {
        svg2css({
            baseDir: projPath,
            cssFilePath: config.cssFilePath,
            svgDir: `svg/${proj.name}`,
            iconName: 'yhicon'
        }, Meteor.bindEnvironment((res) => {
            if (res.result === true) {
                const uploadFile = {
                    path: res.path,
                    name: res.name,
                    meta: {
                        proj: proj.name
                    }
                };
                upload2qiniu(uploadFile, Meteor.bindEnvironment((res) => {
                    const cssUrl = Projects.findOne({ _id: proj._id }).cssUrl;
                    cssUrl.push({
                        url: `${secret.BASE_URL}${res.key}`,
                        createAt: Date.now()
                    });
                    Projects.update({ _id: proj._id }, { $set: { cssUrl: cssUrl } });
                    resolve({url: `${secret.BASE_URL}${res.key}`, msg: 'svg to css 转换成功', res: true});
                }));
            } else {
                resolve({msg: 'svg to css 转换失败', res: false});
            }
        }));
    });
}

export default createCss;
