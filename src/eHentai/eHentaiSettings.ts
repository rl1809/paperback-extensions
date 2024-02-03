import {
    DUINavigationButton,
    SourceStateManager,
    DUIButton
} from '@paperback/types'


export const getExtraArgs = async (stateManager: SourceStateManager): Promise<string> => {
    return (await stateManager.retrieve('extraSearchArgs') as string) ?? `-guro -yaoi -"males only"`
}


export const modifySearch = (stateManager: SourceStateManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: 'modifySearch',
        label: 'Modify Search',
        form: App.createDUIForm({
            sections: () => {
                return Promise.resolve([
                    App.createDUISection({
                        id: 'modifySearchSection',
                        footer: 'Note: searches with only exclusions do not work, including on the home page',
                        rows: async () => {
                            await Promise.all([
                                getExtraArgs(stateManager)
                            ])
                            return await [
                                App.createDUIInputField({
                                    id: 'extraSearchArgs',
                                    label: 'Additional arguments',
                                    value: App.createDUIBinding({
                                        get: () => getExtraArgs(stateManager),
                                        set: async (newValue: string) => {
                                            await stateManager.store(
                                                'extraSearchArgs',
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
                stateManager.store('extraSearchArgs', null)
            ])
        }
    })
}