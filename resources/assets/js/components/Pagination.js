import React from 'react';

const Pagination = (props) => {
  const {
    perPage,
    currentPage,
    total,
    onPageChangeClick
  } = props;

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const totalPages = Math.ceil(total / perPage);

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination table-pagination">
        <li className={ previousPage < 1 ? 'page-item disabled' : 'page-item' }>
          <a
            className="page-link"
            href="#"
            onClick={ e => onPageChangeClick(previousPage) }
          >Prev</a>
        </li>
        <li className={ nextPage > totalPages ? 'page-item disabled' : 'page-item' }>
          <a
            className="page-link"
            href="#"
            onClick={ e => onPageChangeClick(nextPage) }
          >Next</a>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination;
