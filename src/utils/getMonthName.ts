export default function getMonthName(date: string) {
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const formattedDate = new Date(date);
  return monthNames[formattedDate.getMonth()]
}
