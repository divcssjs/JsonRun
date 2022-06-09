```
vue3没有this
所有逻辑代码都在setup
在html上引用需要return

setup处于beforeCreate和Created之间
setup中不能使用data和methods的属性方法

defineComponent函数对setup函数封装，返回options对象
在ts下给与组件正确的参数类型推断

子组件setup前使用async就要在父组件添加此标签 <suspense> 包裹

ref
  创建一个响应式且可改变的值 .value指向该值
toRef
  为源响应式对象的某一个属性新创建一个ref，保持响应式
  const state = reactive({ name: dxw })
  cosnt nameRef = toRef(state, 'name')
toRefs
  不丢失响应式下对返回的对象解构/展开
  const obj = reactive({ age: 15 })
  const { age: ageRef } = toRefs(obj)
  ageRef.value++
```
