package com.test_task.controller;

import com.test_task.model.Month;
import com.test_task.service.MonthService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MainRestController {

    private final MonthService monthService;

    @Autowired
    public MainRestController(MonthService monthService) {
        this.monthService = monthService;
    }


    @PostMapping(value = "/main/search", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Month> searchMonth(@RequestBody String string){
        JSONObject stringJson = new JSONObject(string);
        String name = stringJson.getString("name");
        return monthService.findMonthByString(name);
    }

    @PostMapping(value = "/main/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Month createMonth(@RequestBody String string){
        JSONObject stringJson = new JSONObject(string);
        String name = stringJson.getString("name");
        Month month = new Month(null,name);
        return  monthService.saveMonth(month);
    }

    @PostMapping(value = "/main/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Month> updateMonth(@RequestBody Month month){
        JSONObject stringJson = new JSONObject(month);
        Month monthDB = new Month();
        monthDB.setId(stringJson.getLong("id"));
        monthDB.setName(stringJson.getString("name"));
        return monthService.updateMonth(monthDB);
    }

    @PostMapping(value = "/main/delete", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Month> deleteMonth(@RequestBody String idMonth){
        JSONObject stringId = new JSONObject(idMonth);
        Long id = stringId.getLong("id");
        return monthService.deleteMonth(id);
    }

    @GetMapping(value = "/main/months", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Month> getAllMonth(){
        return monthService.findAllMonth();
    }
}
