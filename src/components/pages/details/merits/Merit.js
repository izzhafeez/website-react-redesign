import Item from '../Item';
import './style.scss';

class Merit extends Item {
  getClassNames() {
    let classNames = 'merits container preview border border-info row align-items-center';
    if (this.isStarred()) {
      classNames += ' starred';
    }
    return classNames;
  }

  getBackLink(type) {
    return `/merits/${type}`;
  }
}

export default Merit;