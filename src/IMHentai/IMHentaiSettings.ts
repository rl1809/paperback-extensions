import {
    DUIButton,
    DUINavigationButton,
    SourceStateManager
} from '@paperback/types'


export const getExtraArgs = async (stateManager: SourceStateManager): Promise<string> => {
    return (await stateManager.retrieve('extra_args') as string) ?? `-guro -scat -yaoi -bbw -bestiality -furry`
}


export const settings = (stateManager: SourceStateManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: 'settings',
        label: 'Content Settings',
        form: App.createDUIForm({
            sections: () => {
                return Promise.resolve([
                    App.createDUISection({
                        id: 'content',
                        footer: 'Tags with a space or "-" in them need to be double quoted. \nExample: "love-saber" and -"big breasts"\nTo exclude tags, add a "-" in the front. To include, add a "+".',
                        rows: async () => {
                            await Promise.all([
                                getExtraArgs(stateManager)
                            ])
                            return await [

                                App.createDUIInputField({
                                    id: 'extra_args',
                                    label: 'Additional arguments',
                                    value: App.createDUIBinding({
                                        get: () => getExtraArgs(stateManager),
                                        set: async (newValue: string) => {
                                            await stateManager.store(
                                                'extra_args',
                                                newValue.replaceAll(/‘|’/g, '\'').replaceAll(/“|”/g, '"')
                                            )
                                        }
                                    })
                                })
                            ]
                        },
                        isHidden: false
                    })
                ])
            }
        })
    })
}

export const resetSettings = (stateManager: SourceStateManager): DUIButton => {
    return App.createDUIButton({
        id: 'reset',
        label: 'Reset to Default',
        onTap: async () => {
            await Promise.all([
                stateManager.store('extra_args', null)
            ])
        }
    })
}
