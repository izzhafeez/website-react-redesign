import './style.scss';
import Items from '../Items';

class Merits extends Items {
  constructor(fields) {
    super({
      category: 'merits',
      ...fields
    });
  }

  getClassNames() {
    switch (this.type) {
      case 'technologies':
      case 'languages':
      case 'skills':
        return 'row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 g-2'
      case 'experiences':
        return 'row row-cols-lg-2 row-cols-1 g-2'
      default:
        return 'row row-cols-xl-3 row-cols-lg-2 row-cols-1 g-2'
    }
  }
}

export default Merits;