################################################################################
# Automatically-generated file. Do not edit!
################################################################################

SHELL = cmd.exe

CG_TOOL_ROOT := C:/DevEnv/ti/ccs1000/ccs/tools/compiler/ti-cgt-arm_20.2.0.LTS

GEN_OPTS__FLAG := 
GEN_CMDS__FLAG := 

ORDERED_OBJS += \
"./Adafruit_GFX.obj" \
"./Adafruit_OLED.obj" \
"./button_if.obj" \
"./gpio_if.obj" \
"./i2c_if.obj" \
"./main.obj" \
"./network_common.obj" \
"./network_if.obj" \
"./pinmux.obj" \
"./startup_ccs.obj" \
"./timer_if.obj" \
"./uart_if.obj" \
"../cc3200v1p32.cmd" \
$(GEN_CMDS__FLAG) \
-l"D:/TI/CC3200SDK_1.5.0/cc3200-sdk/oslib/ccs/free_rtos/free_rtos.a" \
-l"D:/TI/CC3200SDK_1.5.0/cc3200-sdk/simplelink/ccs/OS_debug/simplelink.a" \
-l"D:/TI/CC3200SDK_1.5.0/cc3200-sdk/driverlib/ccs/Release/driverlib.a" \
-l"D:/TI/CC3200SDK_1.5.0/cc3200-sdk/netapps/mqtt/ccs/client/mqtt.a" \
-llibc.a \

-include ../makefile.init

RM := DEL /F
RMDIR := RMDIR /S/Q

# All of the sources participating in the build are defined here
-include sources.mk
-include subdir_vars.mk
-include subdir_rules.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(C55_DEPS)),)
-include $(C55_DEPS)
endif
ifneq ($(strip $(C_UPPER_DEPS)),)
-include $(C_UPPER_DEPS)
endif
ifneq ($(strip $(S67_DEPS)),)
-include $(S67_DEPS)
endif
ifneq ($(strip $(S62_DEPS)),)
-include $(S62_DEPS)
endif
ifneq ($(strip $(S_DEPS)),)
-include $(S_DEPS)
endif
ifneq ($(strip $(OPT_DEPS)),)
-include $(OPT_DEPS)
endif
ifneq ($(strip $(C??_DEPS)),)
-include $(C??_DEPS)
endif
ifneq ($(strip $(ASM_UPPER_DEPS)),)
-include $(ASM_UPPER_DEPS)
endif
ifneq ($(strip $(S??_DEPS)),)
-include $(S??_DEPS)
endif
ifneq ($(strip $(C64_DEPS)),)
-include $(C64_DEPS)
endif
ifneq ($(strip $(CXX_DEPS)),)
-include $(CXX_DEPS)
endif
ifneq ($(strip $(S64_DEPS)),)
-include $(S64_DEPS)
endif
ifneq ($(strip $(INO_DEPS)),)
-include $(INO_DEPS)
endif
ifneq ($(strip $(CLA_DEPS)),)
-include $(CLA_DEPS)
endif
ifneq ($(strip $(S55_DEPS)),)
-include $(S55_DEPS)
endif
ifneq ($(strip $(SV7A_DEPS)),)
-include $(SV7A_DEPS)
endif
ifneq ($(strip $(C62_DEPS)),)
-include $(C62_DEPS)
endif
ifneq ($(strip $(C67_DEPS)),)
-include $(C67_DEPS)
endif
ifneq ($(strip $(PDE_DEPS)),)
-include $(PDE_DEPS)
endif
ifneq ($(strip $(K_DEPS)),)
-include $(K_DEPS)
endif
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
ifneq ($(strip $(CC_DEPS)),)
-include $(CC_DEPS)
endif
ifneq ($(strip $(C++_DEPS)),)
-include $(C++_DEPS)
endif
ifneq ($(strip $(C43_DEPS)),)
-include $(C43_DEPS)
endif
ifneq ($(strip $(S43_DEPS)),)
-include $(S43_DEPS)
endif
ifneq ($(strip $(ASM_DEPS)),)
-include $(ASM_DEPS)
endif
ifneq ($(strip $(S_UPPER_DEPS)),)
-include $(S_UPPER_DEPS)
endif
ifneq ($(strip $(CPP_DEPS)),)
-include $(CPP_DEPS)
endif
ifneq ($(strip $(SA_DEPS)),)
-include $(SA_DEPS)
endif
endif

-include ../makefile.defs

# Add inputs and outputs from these tool invocations to the build variables 
EXE_OUTPUTS += \
mqtt_client_freertos.out \

EXE_OUTPUTS__QUOTED += \
"mqtt_client_freertos.out" \

BIN_OUTPUTS += \
mqtt_client_freertos.bin \

BIN_OUTPUTS__QUOTED += \
"mqtt_client_freertos.bin" \


# All Target
all: $(OBJS) $(CMD_SRCS) $(GEN_CMDS)
	@$(MAKE) --no-print-directory -Onone "mqtt_client_freertos.out"

# Tool invocations
mqtt_client_freertos.out: $(OBJS) $(CMD_SRCS) $(GEN_CMDS)
	@echo 'Building target: "$@"'
	@echo 'Invoking: ARM Linker'
	"C:/DevEnv/ti/ccs1000/ccs/tools/compiler/ti-cgt-arm_20.2.0.LTS/bin/armcl" -mv7M4 --code_state=16 --float_support=none -me -Ooff --define=ccs --define=cc3200 --define=USE_FREERTOS --define=SL_PLATFORM_MULTI_THREADED -g --diag_warning=225 --diag_wrap=off --display_error_number --abi=eabi -z -m"mqtt_client_freertos.map" --heap_size=0x8000 --stack_size=0x5000 -i"C:/DevEnv/ti/ccs1000/ccs/tools/compiler/ti-cgt-arm_20.2.0.LTS/lib" -i"C:/DevEnv/ti/ccs1000/ccs/tools/compiler/ti-cgt-arm_20.2.0.LTS/include" --reread_libs --diag_wrap=off --display_error_number --warn_sections --xml_link_info="mqtt_client_freertos_linkInfo.xml" --rom_model -o "mqtt_client_freertos.out" $(ORDERED_OBJS)
	@echo 'Finished building target: "$@"'
	@echo ' '
	@$(MAKE) --no-print-directory post-build

mqtt_client_freertos.bin: $(EXE_OUTPUTS)
	@echo 'Building files: $(strip $(EXE_OUTPUTS__QUOTED))'
	@echo 'Invoking: ARM Hex Utility'
	"C:/DevEnv/ti/ccs1000/ccs/tools/compiler/ti-cgt-arm_20.2.0.LTS/bin/armhex"  -o "mqtt_client_freertos.bin" $(EXE_OUTPUTS__QUOTED)
	@echo 'Finished building: $(strip $(EXE_OUTPUTS__QUOTED))'
	@echo ' '
	@$(MAKE) --no-print-directory post-build

# Other Targets
clean:
	-$(RM) $(BIN_OUTPUTS__QUOTED)$(EXE_OUTPUTS__QUOTED)
	-$(RM) "Adafruit_GFX.obj" "Adafruit_OLED.obj" "button_if.obj" "gpio_if.obj" "i2c_if.obj" "main.obj" "network_common.obj" "network_if.obj" "pinmux.obj" "startup_ccs.obj" "timer_if.obj" "uart_if.obj" 
	-$(RM) "Adafruit_GFX.d" "Adafruit_OLED.d" "button_if.d" "gpio_if.d" "i2c_if.d" "main.d" "network_common.d" "network_if.d" "pinmux.d" "startup_ccs.d" "timer_if.d" "uart_if.d" 
	-@echo 'Finished clean'
	-@echo ' '

post-build:
	-C:/DevEnv/ti/ccs1000/ccs/utils/tiobj2bin/tiobj2bin mqtt_client_freertos.out mqtt_client_freertos.bin C:/DevEnv/ti/ccs1000/ccs/tools/compiler/ti-cgt-arm_20.2.0.LTS/bin/armofd C:/DevEnv/ti/ccs1000/ccs/tools/compiler/ti-cgt-arm_20.2.0.LTS/bin/armhex C:/DevEnv/ti/ccs1000/ccs/utils/tiobj2bin/mkhex4bin
	-@echo ' '

.PHONY: all clean dependents
.SECONDARY:

-include ../makefile.targets

