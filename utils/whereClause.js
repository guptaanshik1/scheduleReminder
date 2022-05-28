// base - Product.find()
// bigQuery = search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=999

class WhereClause {
  constructor(base, bigQuery) {
    this.base = base;
    this.bigQuery = bigQuery;
  }

  search() {
    const searchInQuery = this.bigQuery.search
      ? {
          name: {
            // Product.find({ email: '.....' }) name is email here
            $regex: this.bigQuery.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchInQuery });
    return this;
  }

  filter() {
    const copyOfQuery = { ...this.bigQuery };

    // deleting the fields which are not required in this method (like search and page)
    delete copyOfQuery["search"];
    delete copyOfQuery["page"];
    delete copyOfQuery["limit"];

    // now converting to string to add $ before gte or lte
    let strOfCopyQuery = JSON.stringify(copyOfQuery);
    strOfCopyQuery = strOfCopyQuery.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (m) => `$${m}`
    );

    // converting back to json
    const jsonOfCopyQuery = JSON.parse(strOfCopyQuery);

    this.base = this.base.find(jsonOfCopyQuery);
    return this;
  }

  pager(resultPerPage) {
    let currentPage = 1;
    currentPage = this.base.page ? this.base.page : 1;

    const valueToBeSkipped = resultPerPage * (currentPage - 1);

    this.base = this.base.limit(resultPerPage).skip(valueToBeSkipped);
    return this;
  }
}

module.exports = WhereClause;