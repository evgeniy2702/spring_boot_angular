package com.test_task.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InputValueString {

    public String name;

    public InputValueString(String name) {
        this.name = name;
    }

    public InputValueString() {
    }
}
