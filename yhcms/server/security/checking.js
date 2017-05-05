import whiteList from '../../whiteList.json';

function checking(self, require) {
  console.log(require);
  if (!whiteList.ids.includes(self.userId)) {
    throw new Meteor.Error('permission denied');
  }
  for (const prop in require) {
    if (prop !== '' && !require[prop]) {
      throw new Meteor.Error('params missing');
    }
  }
}

export default checking;
