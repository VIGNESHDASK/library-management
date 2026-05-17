/**
 * Parse date string in DD-MM-YYYY format to Date object
 * @param {string} dateString - Date in DD-MM-YYYY format
 * @returns {Date} Parsed date object
 */
export const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  /**
   * Format Date object to DD-MM-YYYY string
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string
   */
  export const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  /**
   * Get the closest available date in data by looking backwards from start date
   * @param {Date} startDate - Starting date to look from
   * @param {Array} data - Array of data objects with date property
   * @returns {Date} Closest available date
   */
  export const getClosestDate = (startDate, data) => {
    const workingDate = new Date(startDate);
    let formattedDate = formatDate(workingDate);
    
    const isDateAvailable = (dateStr) => data.some(item => item.date === dateStr);
    
    while (!isDateAvailable(formattedDate) && workingDate.getDate() > 1) {
      workingDate.setDate(workingDate.getDate() - 1);
      formattedDate = formatDate(workingDate);
    }
    return workingDate;
  };
  
  /**
   * Calculate percentage difference between two values
   * @param {number} value1 - First value
   * @param {number} value2 - Second value
   * @returns {number} Percentage difference
   */
  export const calculatePercentageDifference = (value1, value2) => {
    if (value2 === 0) return 0;
    return ((value1 - value2) / value2) * 100;
  };
  
  