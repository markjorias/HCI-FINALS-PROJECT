/* menu.js - Menu filtering logic */

document.addEventListener('DOMContentLoaded', () => {
  const filterItems = document.querySelectorAll('.filter-item');
  const itemCards = document.querySelectorAll('.item-card');

  filterItems.forEach(filter => {
    filter.addEventListener('click', () => {
      // Update active state in UI
      filterItems.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      const selectedCategory = filter.querySelector('span').textContent.trim();

      // Filter items
      itemCards.forEach(card => {
        const itemCategory = card.querySelector('.item-category').textContent.trim();
        
        if (selectedCategory === 'All' || itemCategory === selectedCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
