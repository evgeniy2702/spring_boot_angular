package com.test_task.repository;


import com.test_task.model.Month;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthRepository extends JpaRepository<Month, Long> {

    Month getMonthByName(String name);

    Month findMonthById(Long id);

}
