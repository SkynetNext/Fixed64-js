cmake_minimum_required(VERSION 3.15)

project(Fixed64 VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20) 
set(CMAKE_CXX_STANDARD_REQUIRED True)

if(NOT TARGET_OUTPUT_PATH)
  set(TARGET_OUTPUT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../../dist")
else()
  if(NOT IS_ABSOLUTE ${TARGET_OUTPUT_PATH})
    set(TARGET_OUTPUT_PATH "${CMAKE_CURRENT_SOURCE_DIR}/${TARGET_OUTPUT_PATH}")
  endif()
endif()

set(COMMON_OPTS "-O3 -flto -Werror")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${COMMON_OPTS}")

# Define the target first
add_executable(Fixed64 "")

target_include_directories(Fixed64 PRIVATE
    "${CMAKE_CURRENT_SOURCE_DIR}/include"
)

# Adjust the function to use target_include_directories and target_sources
function(include_and_source_subdirectories root_dir)
    file(GLOB children RELATIVE ${root_dir} ${root_dir}/*)
    foreach(child ${children})
        if(IS_DIRECTORY ${root_dir}/${child})
            target_include_directories(Fixed64 PRIVATE ${root_dir}/${child})
            include_and_source_subdirectories(${root_dir}/${child}) # Recursive call
        endif()
    endforeach()
    # Add .cpp files from the current directory to the source list
    file(GLOB current_dir_src "${root_dir}/*.cpp")
    if(current_dir_src)
        target_sources(Fixed64 PRIVATE ${current_dir_src})
    endif()
endfunction()

# Include directories and source files from Fixed64 recursively
include_and_source_subdirectories("${CMAKE_CURRENT_SOURCE_DIR}/src")

# Link options and properties
target_link_options(Fixed64 PRIVATE "SHELL:-s WASM=1 -s DYNAMIC_EXECUTION=0 --bind -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 --emit-tsd Fixed64.d.ts")
set_target_properties(Fixed64 PROPERTIES
    SUFFIX ".js"
    RUNTIME_OUTPUT_DIRECTORY ${TARGET_OUTPUT_PATH}
)